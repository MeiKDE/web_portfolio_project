//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withOwnership,
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";
import { handleApiError, createApiError } from "@/app/lib/api/error-handler";
import { z } from "zod";

// Define schema for validation
const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  username: z.string().optional(),
});

// Define user update schema
const userUpdateSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  phone: z.string().optional(),
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

// DELETE a social link
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.socialLink.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "Social link deleted successfully" });
    } catch (error) {
      return handleApiError(error);
    }
  },
  "socialLink"
);

// CREATE a new social link
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    const socialLink = await prisma.socialLink.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return successResponse(socialLink, "Social link created successfully", 201);
  } catch (error) {
    console.error("Error creating social link:", error);
    return errorResponse("Failed to create social link", 500);
  }
}
