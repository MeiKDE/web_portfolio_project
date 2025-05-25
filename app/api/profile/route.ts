// -----------------------------------------------------
// GET /api/profile - Get user profile (current user or specified userId)
// PUT /api/profile - Update user profile
// POST /api/profile - Save user profile data
// -----------------------------------------------------

import prisma from "@/app/lib/db/prisma";
import { withAuth } from "@/app/lib/api/api-helpers";
import { NextRequest, NextResponse } from "next/server";
import { updateUserProfile } from "@/app/lib/services/user-service";

// GET user profile
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
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...userProfile,
      isGoogleAccount: userProfile.provider === "GOOGLE",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
});

// UPDATE user profile
export const PUT = withAuth(async (request: NextRequest, context, user) => {
  try {
    const data = await request.json();

    // TODO: Add validation schema for profile updates
    // const validationResult = profileUpdateSchema.safeParse(data);
    // if (!validationResult.success) {
    //   return NextResponse.json(
    //     { error: validationResult.error.errors[0].message },
    //     { status: 400 }
    //   );
    // }

    const updatedProfile = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...data,
        email: user.provider === "GOOGLE" ? user.email : data.email,
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

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
});

// SAVE profile data
export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    const body = await request.json();
    const { profileData } = body;

    if (!profileData) {
      return NextResponse.json(
        { error: "No profile data provided" },
        { status: 400 }
      );
    }

    // TODO: Add validation schema for profile data
    // const validationResult = profileSchema.safeParse(profileData);
    // if (!validationResult.success) {
    //   return NextResponse.json(
    //     { error: validationResult.error.errors[0].message },
    //     { status: 400 }
    //   );
    // }

    await updateUserProfile(user.id, profileData);

    return NextResponse.json({
      message: "Profile saved successfully",
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save profile",
      },
      { status: 500 }
    );
  }
});
