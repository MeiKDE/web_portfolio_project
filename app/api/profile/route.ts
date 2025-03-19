import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!session) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
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
      return NextResponse.json(errorResponse("User profile not found"), {
        status: 404,
      });
    }

    return NextResponse.json(
      successResponse({
        ...userProfile,
        isGoogleAccount: userProfile.provider === "GOOGLE",
      })
    );
  } catch (error) {
    console.error("Error handling profile:", error);
    return NextResponse.json(errorResponse("Failed to process profile data"), {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
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

    return NextResponse.json(successResponse(updatedProfile));
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(errorResponse("Failed to update profile"), {
      status: 500,
    });
  }
}
