import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse } from "@/lib/api-helpers";
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
        return new Response(JSON.stringify({ error: "Education not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // No need to transform data anymore
      return successResponse(education);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to retrieve education entry",
        "GET /users/[userId]/education/[id]"
      );
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

      // No need to transform data anymore
      const education = await prisma.education.update({
        where: {
          id: params.id,
          userId: params.userId,
        },
        data,
      });

      return successResponse(education);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to update education entry",
        "PUT /users/[userId]/education/[id]"
      );
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
      return handleApiError(
        error,
        "Failed to delete education entry",
        "DELETE /users/[userId]/education/[id]"
      );
    }
  }
);
