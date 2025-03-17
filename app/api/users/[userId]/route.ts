//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (getting and updating).

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Helper functions for consistent responses
const successResponse = (data: any) => {
  return NextResponse.json({ success: true, data }, { status: 200 });
};

const errorResponse = (message: string, status = 400) => {
  return NextResponse.json({ success: false, message }, { status });
};

// GET handler for fetching user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return errorResponse("Unauthorized", 401);
  }

  const { userId } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse("Failed to fetch user", 500);
  }
}

// PUT handler for updating user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return errorResponse("Unauthorized", 401);
  }

  const { userId } = params;

  // Ensure the user can only update their own profile
  if (session.user.id !== userId) {
    return errorResponse("You can only update your own profile", 403);
  }

  try {
    const body = await request.json();

    const {
      name,
      title,
      location,
      bio,
      phone,
      profile_email,
      image,
      isAvailable,
    } = body;

    console.log("Received update data:", body);

    // Update the user record directly with fields from your schema
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        title,
        location,
        bio,
        phone,
        profile_email,
        image,
        isAvailable: isAvailable === undefined ? null : isAvailable,
      },
    });

    console.log("Updated user data:", updatedUser);

    return successResponse(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);

    // Provide more detailed error information
    if (error instanceof Error) {
      return errorResponse(
        `Failed to update user profile: ${error.message}`,
        500
      );
    }

    return errorResponse("Failed to update user profile", 500);
  }
}
