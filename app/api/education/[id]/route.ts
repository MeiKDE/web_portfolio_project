//Summary
// This file ([id]/route.ts) is focused on managing existing education entries (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withOwnership, successResponse } from "@/lib/api-helpers";
import { handleApiError, createApiError } from "@/lib/error-handler";

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
        return createApiError.notFound("Education entry not found");
      }

      return successResponse(education);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to retrieve education",
        "GET /education/[id]"
      );
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
      return handleApiError(
        error,
        "Failed to update education",
        "PUT /education/[id]"
      );
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
      return handleApiError(
        error,
        "Failed to delete education",
        "DELETE /education/[id]"
      );
    }
  },
  "education"
);
