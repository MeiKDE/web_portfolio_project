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
import { z } from "zod";
import { handleApiError } from "@/app/lib/api/error-handler";

// Define schema for validation
const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100),
  description: z.string().optional(),
});

// GET all skills for a specific user
export const GET = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      console.log("Fetching education for user:", params.id);
      const id = params.id;

      // Fetch the education for the specified user
      const education = await prisma.education.findMany({
        where: {
          id: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return successResponse(education);
    } catch (error) {
      console.error("Error fetching education:", error);

      if (error instanceof Error) {
        return errorResponse(
          `Failed to fetch education: ${error.message}`,
          500
        );
      }

      return errorResponse("Failed to fetch education", 500);
    }
  }
);

// POST a new skill for a specific user
export const POST = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      const userId = params.userId;

      // Only allow users to add skills to their own profile
      if (user.id !== userId) {
        return errorResponse("Forbidden", 403);
      }

      // Get the skill data from the request
      const data = await request.json();

      // Validate the data
      const validationResult = educationSchema.safeParse(data);

      if (!validationResult.success) {
        return errorResponse(
          "Invalid education data: " +
            JSON.stringify(validationResult.error.format()),
          400
        );
      }

      // Create the new education
      const education = await prisma.education.create({
        data: {
          institution: validationResult.data.institution,
          degree: validationResult.data.degree,
          fieldOfStudy: validationResult.data.fieldOfStudy,
          startYear: validationResult.data.startYear,
          endYear: validationResult.data.endYear,
          description: validationResult.data.description,
          userId: userId,
        },
      });

      return successResponse(education);
    } catch (error) {
      console.error("Error creating education:", error);

      if (error instanceof z.ZodError) {
        return errorResponse(
          "Validation error: " + JSON.stringify(error.format()),
          400
        );
      }

      if (error instanceof Error) {
        return errorResponse(
          `Failed to create education: ${error.message}`,
          500
        );
      }

      return errorResponse("Failed to create education", 500);
    }
  }
);

// UPDATE an education entry
export const PUT = withAuth(async (request: NextRequest, { params }, user) => {
  try {
    const data = await request.json();

    // Validate the data
    const validationResult = educationSchema.safeParse(data);
    if (!validationResult.success) {
      return errorResponse(
        "Invalid education data: " +
          JSON.stringify(validationResult.error.format()),
        400
      );
    }

    // Verify education ownership
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!existingEducation) {
      return errorResponse("Education entry not found", 404);
    }

    if (existingEducation.userId !== user.id) {
      return errorResponse(
        "Not authorized to update this education entry",
        403
      );
    }

    const updatedEducation = await prisma.education.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    return successResponse(updatedEducation);
  } catch (error) {
    return handleApiError(error);
  }
});

// DELETE an education entry
export const DELETE = withOwnership(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      await prisma.education.delete({
        where: {
          id: params.id,
        },
      });

      return successResponse({ message: "Education deleted successfully" });
    } catch (error) {
      return handleApiError(error);
    }
  },
  "education"
);
