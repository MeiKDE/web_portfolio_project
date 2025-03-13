import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";
import { z } from "zod";

// Define validation schema for user profile updates
const userProfileSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

// GET current user's profile
export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    // Find the user
    const userProfile = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
      },
    });

    if (!userProfile) {
      return errorResponse("User not found", 404);
    }

    return successResponse(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);

    if (error instanceof Error) {
      return errorResponse(`Failed to fetch user profile: ${error.message}`);
    }

    return errorResponse("Failed to fetch user profile");
  }
});

// UPDATE current user's profile
export const PUT = withAuth(async (request: NextRequest, context, user) => {
  try {
    // Find the user
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      return errorResponse("User not found", 404);
    }

    // Get the updated data
    const data = await request.json();

    // Validate the data
    const validationResult = userProfileSchema.safeParse(data);

    if (!validationResult.success) {
      return errorResponse(
        "Invalid user profile data",
        400,
        validationResult.error.format()
      );
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
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
      },
    });

    return successResponse(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error instanceof z.ZodError) {
      return errorResponse("Validation error", 400, error.format());
    }

    if (error instanceof Error) {
      return errorResponse(`Failed to update user profile: ${error.message}`);
    }

    return errorResponse("Failed to update user profile");
  }
});
