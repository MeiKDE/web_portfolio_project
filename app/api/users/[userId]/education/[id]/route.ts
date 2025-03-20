import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";
import { handleApiError } from "@/lib/error-handler";

// GET a specific education entry
export const GET = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string; id: string } }
  ) => {
    try {
      const education = await prisma.education.findUnique({
        where: {
          id: params.id,
          userId: params.userId,
        },
      });

      if (!education) {
        return errorResponse("Education not found", 404);
      }

      return successResponse(education);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

// UPDATE a specific education entry
export const PUT = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string; id: string } }
  ) => {
    try {
      const data = await request.json();

      const education = await prisma.education.update({
        where: {
          id: params.id,
          userId: params.userId,
        },
        data,
      });

      return successResponse(education);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

// DELETE a specific education entry
export const DELETE = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string; id: string } }
  ) => {
    try {
      await prisma.education.delete({
        where: {
          id: params.id,
          userId: params.userId,
        },
      });

      return successResponse({
        message: "Education entry deleted successfully",
      });
    } catch (error) {
      return handleApiError(error);
    }
  }
);
