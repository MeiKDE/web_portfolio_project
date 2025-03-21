//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withAuth,
  withOwnership,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { handleApiError } from "@/app/lib/api/error-handler";
import { experienceSchema } from "@/app/hooks/validations"; // Assuming you have this

// GET a single experience
export const GET = withOwnership(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const experience = await prisma.experience.findUnique({
        where: {
          id: params.id,
        },
      });

      if (!experience) {
        return errorResponse("Experience not found", 404);
      }

      return successResponse(experience);
    } catch (error) {
      return handleApiError(error);
    }
  },
  "experience" // This should match your Prisma model name
);

// UPDATE an experience
export const PUT = withOwnership(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
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
        where: {
          id: params.id,
        },
        data: validationResult.data,
      });

      return successResponse(updatedExperience);
    } catch (error) {
      return handleApiError(error);
    }
  },
  "experience"
);

// DELETE an experience
export const DELETE = withOwnership(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      await prisma.experience.delete({
        where: {
          id: params.id,
        },
      });

      return successResponse({ message: "Experience deleted successfully" });
    } catch (error) {
      return handleApiError(error);
    }
  },
  "experience"
);
