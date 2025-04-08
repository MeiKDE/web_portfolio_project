// Create route to get single user by id

import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";
import prisma from "@/app/lib/db/prisma";
import { userProfileSchema } from "@/app/hooks/validations";

export const GET = withAuth(async (request: NextRequest, { params }, user) => {
  try {
    const { id } = params;

    // Add debugging logs
    console.log("Requested user ID:", id);
    console.log("Current authenticated user:", user);

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
        profile_email: true,
        isUploadResumeForProfile: true,
        hasCompletedProfileSetup: true,
        profileImageUrl: true,
      },
    });

    // Add debugging log
    console.log("Database query result:", targetUser);

    if (!targetUser) {
      console.log("User not found in database");
      return errorResponse("User not found", 404);
    }

    return successResponse(targetUser);
  } catch (error) {
    // Enhanced error logging
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch user",
      500
    );
  }
});

// create a PUT method to update the user
export const PUT = withAuth(async (request: NextRequest, { params }, user) => {
  try {
    const { id } = params;

    // Verify user is updating their own profile
    if (id !== user.id) {
      return errorResponse("Not authorized to update this profile", 403);
    }

    const data = await request.json();

    // Clean the data by removing null/undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );

    // Validate the update data using userProfileSchema
    const validationResult = userProfileSchema.safeParse(cleanedData);
    if (!validationResult.success) {
      return errorResponse(
        "Invalid update data",
        400,
        validationResult.error.format()
      );
    }

    // Update user profile with validated data
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validationResult.data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
        profile_email: true,
        provider: true,
        isUploadResumeForProfile: true,
        hasCompletedProfileSetup: true,
        profileImageUrl: true,
      },
    });

    return successResponse(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return errorResponse("Failed to update user", 500);
  }
});
