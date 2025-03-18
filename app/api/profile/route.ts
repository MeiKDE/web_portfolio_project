import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!session) {
      return errorResponse(401, "Unauthorized");
    }

    const targetUserId = userId || session.user.id;

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
      return errorResponse(404, "User profile not found");
    }

    return successResponse({
      ...userProfile,
      isGoogleAccount: userProfile.provider === "GOOGLE",
    });
  } catch (error) {
    console.error("Error handling profile:", error);
    return errorResponse(500, "Failed to process profile data");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return errorResponse(401, "Unauthorized");
    }

    const data = await request.json();

    const updatedProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...data,
        // Only update email if it's not a Google account
        email: session.provider === "google" ? session.user.email : data.email,
        // Preserve the authentication provider
        provider: session.provider || "credentials",
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
    return errorResponse(500, "Failed to update profile");
  }
}
