//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withOwnership,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { handleApiError, createApiError } from "@/app/lib/api/error-handler";

// UPDATE a project
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      const updatedProject = await prisma.project.update({
        where: { id: params.id },
        data,
      });

      return successResponse(updatedProject);
    } catch (error) {
      return handleApiError(error);
    }
  },
  "project"
);

// DELETE a project
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.project.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "Project deleted successfully" });
    } catch (error) {
      return handleApiError(error);
    }
  },
  "project"
);
