//Summary
// This file ([id]/route.ts) is focused on managing existing education entries (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withOwnership,
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";
import { handleApiError, createApiError } from "@/app/lib/api/error-handler";

// GET a specific education entry
export const GET = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const education = await prisma.education.findUnique({
        where: { id: params.id },
      });

      if (!education) {
        return handleApiError(new Error("Education entry not found"));
      }

      return successResponse(education);
    } catch (error) {
      return handleApiError(error);
    }
  },
  "education"
);

// UPDATE an education entry
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      const education = await prisma.education.update({
        where: { id: params.id },
        data,
      });

      return successResponse(education);
    } catch (error) {
      return handleApiError(error);
    }
  },
  "education"
);

// DELETE an education entry
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.education.delete({
        where: { id: params.id },
      });

      return successResponse({
        message: "Education entry deleted successfully",
      });
    } catch (error) {
      return handleApiError(error);
    }
  },
  "education"
);

// CREATE a new education entry for a specific user
export const POST = withAuth(
  async (request: NextRequest, { params }: { params: { userId: string } }) => {
    try {
      const data = await request.json();

      // No need to transform data anymore
      const education = await prisma.education.create({
        data: {
          ...data,
          userId: params.userId,
        },
      });

      return successResponse(education);
    } catch (error) {
      console.error("Error creating education:", error);
      return errorResponse("Failed to create education entry", 500);
    }
  }
);
