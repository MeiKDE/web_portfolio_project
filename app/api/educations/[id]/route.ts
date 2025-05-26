//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { educationSchema } from "@/app/hooks/validations";
import {
  withOwnership,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";

// GET a single education
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const data = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!data) {
      return errorResponse("Education not found");
    }

    // Validate the database data against the schema
    const validationResult = educationSchema.safeParse(data);

    if (!validationResult.success) {
      return errorResponse("Invalid education data in database");
    }

    return successResponse(validationResult.data);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Failed to fetch education",
      500
    );
  }
};

// UPDATE an education
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      // Validate the incoming data
      const validationResult = educationSchema.safeParse(data);

      if (!validationResult.success) {
        return errorResponse(
          "Invalid education data",
          400,
          validationResult.error.format()
        );
      }

      const updatedEducation = await prisma.education.update({
        where: { id: params.id },
        data: validationResult.data,
      });

      return successResponse(updatedEducation);
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "Failed to update education",
        500
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

      return successResponse({ message: "Education deleted successfully" });
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "Failed to delete education",
        500
      );
    }
  },
  "education"
);
