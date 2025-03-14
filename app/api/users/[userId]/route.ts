//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (getting and updating).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse } from "@/lib/api-helpers";
import { handleApiError, createApiError } from "@/lib/error-handler";
import { z } from "zod";

// Define validation schema for user updates
const userUpdateSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

// GET user by ID from User table
export const GET = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      const userId = params.userId;

      // Fetch the user
      const userProfile = await prisma.user.findUnique({
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

      if (!userProfile) {
        throw createApiError.notFound("User not found");
      }

      return successResponse(userProfile);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to fetch user",
        "GET /users/[userId]"
      );
    }
  }
);

// UPDATE user
export const PUT = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      // Only allow users to update their own profile unless they're an admin
      if (user.id !== params.userId && !(user as any).isAdmin) {
        throw createApiError.forbidden("You can only update your own profile");
      }

      const data = await request.json();

      // Validate the data
      const validationResult = userUpdateSchema.safeParse(data);

      if (!validationResult.success) {
        throw createApiError.badRequest(
          "Invalid user data",
          validationResult.error.format()
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: params.userId },
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
          isAvailable: true,
        },
      });

      return successResponse(updatedUser);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to update user",
        "PUT /users/[userId]"
      );
    }
  }
);
