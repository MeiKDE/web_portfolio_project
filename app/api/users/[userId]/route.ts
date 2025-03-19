//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (getting and updating).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  successResponse,
  errorResponse,
  withAuth,
  validateRequest,
} from "@/lib/api-helpers";
import { handleApiError, createApiError } from "@/lib/error-handler";

// Define validation schema for user updates
const userUpdateSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  profile_email: z.string().email().optional(),
  image: z.string().url().optional(),
  isAvailable: z.boolean().nullable().optional(),
});

// GET handler for fetching user profile
export const GET = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    currentUser
  ) => {
    try {
      const { userId } = params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw createApiError.notFound("User not found");
      }

      // Remove sensitive fields
      const { hashedPassword, salt, ...safeUserData } = user;

      return successResponse(safeUserData);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to fetch user",
        "GET /api/users/[userId]"
      );
    }
  }
);

// PUT handler for updating user profile
export const PUT = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    currentUser
  ) => {
    try {
      const { userId } = params;

      // Ensure the user can only update their own profile
      if (currentUser.id !== userId) {
        throw createApiError.forbidden("You can only update your own profile");
      }

      // Validate the request body
      const updateData = await validateRequest(request, userUpdateSchema);

      // Update the user record
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      // Remove sensitive fields
      const { hashedPassword, salt, ...safeUserData } = updatedUser;

      return successResponse(safeUserData);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to update user profile",
        "PUT /api/users/[userId]"
      );
    }
  }
);
