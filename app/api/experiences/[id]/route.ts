//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withOwnership,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { experienceSchema } from "@/app/hooks/validations"; // Assuming you have this

// GET a single experience
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const data = await prisma.experience.findUnique({
      where: { id: params.id },
    });

    if (!data) {
      return errorResponse("Experience not found");
    }

    // Validate the database data against the schema
    const validationResult = experienceSchema.safeParse(data);

    if (!validationResult.success) {
      return errorResponse("Invalid experience data in database");
    }

    return successResponse(validationResult.data);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Failed to fetch experience",
      500
    );
  }
};

// UPDATE an experience
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      // Validate the incoming data
      const validationResult = experienceSchema.safeParse(data);

      if (!validationResult.success) {
        return errorResponse(
          "Invalid experience data",
          400,
          validationResult.error.format()
        );
      }

      const updatedExperience = await prisma.experience.update({
        where: { id: params.id },
        data: validationResult.data,
      });

      return successResponse(updatedExperience);
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "Failed to update experience",
        500
      );
    }
  },
  "experience"
);

// DELETE an experience
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.experience.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "Experience deleted successfully" });
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "Failed to delete experience",
        500
      );
    }
  },
  "experience"
);
