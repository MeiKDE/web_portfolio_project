import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";

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

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: data.name,
        title: data.title,
        location: data.location,
        phone: data.phone,
        bio: data.bio,
      },
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
    return errorResponse("Failed to update user profile");
  }
});
