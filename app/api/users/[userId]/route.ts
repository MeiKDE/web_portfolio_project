//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (getting and updating).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  successResponse,
  errorResponse,
  withAuth,
  validateRequest,
} from "@/lib/api-helpers";

// Define validation schema for user updates
const userUpdateSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  profile_email: z.string().email().optional(),
  // Allow null or empty strings for image (will be handled in validation)
  image: z.string().url().nullish().or(z.literal("")),
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
        return errorResponse("User not found", 404);
      }

      // Remove sensitive fields
      const { hashedPassword, salt, ...safeUserData } = user;

      return successResponse(safeUserData);
    } catch (error) {
      console.error("Error fetching user:", error);
      return errorResponse("Failed to fetch user", 500);
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
      console.log("PUT handler started for userId:", userId);

      // Ensure the user can only update their own profile
      if (currentUser.id !== userId) {
        console.log("Authorization failed: userId mismatch");
        return errorResponse("You can only update your own profile", 403);
      }

      // Get the request body data
      let updateData;
      try {
        // Get raw body and parse as JSON
        const bodyText = await request.text();
        console.log("Raw request body:", bodyText);

        // Parse JSON manually for validation
        const bodyData = JSON.parse(bodyText);

        // Validate directly with Zod instead of using validateRequest
        const validationResult = userUpdateSchema.safeParse(bodyData);

        if (!validationResult.success) {
          console.error("Validation errors:", validationResult.error);
          return errorResponse(
            "Validation failed",
            400,
            validationResult.error.format()
          );
        }

        // Use the validated data
        updateData = validationResult.data;
        console.log("Validation succeeded:", updateData);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        return errorResponse("Invalid request data", 400);
      }

      // Log the user data for debugging
      console.log("Updating user:", userId, "with data:", updateData);

      try {
        // Update the user record
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: updateData,
        });

        // Remove sensitive fields
        const { hashedPassword, salt, ...safeUserData } = updatedUser;

        return successResponse(safeUserData);
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Type check dbError before accessing properties
        if (
          dbError &&
          typeof dbError === "object" &&
          "code" in dbError &&
          dbError.code === "P2025"
        ) {
          return errorResponse("User not found", 404);
        }
        return errorResponse("Database error occurred", 500);
      }
    } catch (error) {
      console.error("Unhandled error in PUT handler:", error);
      return errorResponse("Internal server error", 500);
    }
  }
);
