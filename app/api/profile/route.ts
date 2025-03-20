import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, withAuth } from "@/lib/api-helpers";
import { NextRequest, NextResponse } from "next/server";

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
