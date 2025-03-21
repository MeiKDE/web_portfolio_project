// Create route to get single user by id

import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/lib/api/api-helpers";
import prisma from "@/app/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get user by ID
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Remove sensitive fields before returning
    const { hashedPassword, salt, ...safeUserData } = user;

    return successResponse(safeUserData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse("Failed to fetch user", 500);
  }
}
