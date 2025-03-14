//Summary
// This file (education/route.ts) is focused on getting all education entries for a user.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse } from "@/lib/api-helpers";
import { handleApiError } from "@/lib/error-handler";

// GET all education entries for a specific user
export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { userId: string } }) => {
    try {
      const educations = await prisma.education.findMany({
        where: { userId: params.userId },
        orderBy: { startYear: "desc" },
      });

      // No need to transform data anymore
      return successResponse(educations);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to retrieve education entries",
        "GET /users/[userId]/education"
      );
    }
  }
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
      return handleApiError(
        error,
        "Failed to create education entry",
        "POST /users/[userId]/education"
      );
    }
  }
);
