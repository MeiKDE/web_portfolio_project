//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (getting and updating).

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { userProfileSchema } from "@/lib/validations";

// GET user by ID from User table
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse("Not authenticated", 401);
    }

    const userId = params.userId;

    // Security check: Only allow users to access their own data
    // unless you want to implement admin access later
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email || "" },
    });

    if (!currentUser || currentUser.id !== userId) {
      return errorResponse("Unauthorized access", 403);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
        isAvailable: true,
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse("Error fetching user data", 500);
  }
}

// UPDATE user
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse("Not authenticated", 401);
    }

    const userId = params.userId;

    // Security check: Only allow users to update their own data
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email || "" },
    });

    if (!currentUser || currentUser.id !== userId) {
      return errorResponse("Unauthorized access", 403);
    }

    const body = await request.json();

    // Validate the request body
    const validatedData = userProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        title: validatedData.title,
        location: validatedData.location,
        phone: validatedData.phone,
        bio: validatedData.bio,
        isAvailable: validatedData.isAvailable,
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
        isAvailable: true,
      },
    });

    return successResponse(updatedUser);
  } catch (error: unknown) {
    console.error("Error updating user:", error);

    // Return more specific error messages for validation errors
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "ZodError"
    ) {
      return errorResponse("Invalid user data", 400);
    }

    return errorResponse("Error updating user data", 500);
  }
}
