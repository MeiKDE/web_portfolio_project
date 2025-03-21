import prisma from "@/app/lib/db/prisma";
import {
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";
import { NextRequest, NextResponse } from "next/server";
import { updateUserProfile } from "@/app/lib/services/user-service";

export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const targetUserId = userId || user.id;

    const userProfile = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        provider: true,
        isUploadResumeForProfile: true,
        hasCompletedProfileSetup: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
        profileImageUrl: true,
      },
    });

    if (!userProfile) {
      return errorResponse("User profile not found", 404);
    }

    return successResponse({
      ...userProfile,
      isGoogleAccount: userProfile.provider === "GOOGLE",
    });
  } catch (error) {
    console.error("Error handling profile:", error);
    return errorResponse("Failed to process profile data", 500);
  }
});

export const PUT = withAuth(async (request: NextRequest, context, user) => {
  try {
    const data = await request.json();

    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...data,
        // Only update email if it's not a Google account
        email: user.provider === "GOOGLE" ? user.email : data.email,
        // Preserve the authentication provider
        provider: user.provider || "credentials",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        provider: true,
        isUploadResumeForProfile: true,
        hasCompletedProfileSetup: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
        profileImageUrl: true,
      },
    });

    return successResponse(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return errorResponse("Failed to update profile", 500);
  }
});

export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("ln12: body", body);
    const { profileData } = body;

    if (!profileData) {
      console.log("ln16: No profile data provided");
      return errorResponse("No profile data provided", 400);
    }

    // Update user profile with parsed data
    await updateUserProfile(user.id, profileData);

    return successResponse({
      message: "Profile saved successfully",
    });
  } catch (error) {
    console.log("Profile save error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to save profile",
      500
    );
  }
});
