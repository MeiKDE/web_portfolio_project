//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (getting and updating).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// GET user by ID from User table
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        // Include any other non-sensitive fields you need
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse("Failed to fetch user");
  }
}

// UPDATE user
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data,
    });

    return successResponse(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse("Failed to update user");
  }
}
