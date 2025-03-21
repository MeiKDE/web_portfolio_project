//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withOwnership,
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";
import { handleApiError, createApiError } from "@/app/lib/api/error-handler";
import { z } from "zod";

// Define schema for validation
const skillUpdateSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiencyLevel: z.number().int().min(1).max(5),
  category: z.string().optional(),
});

// UPDATE a skill
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      // Validate the data
      const validationResult = skillUpdateSchema.safeParse(data);

      if (!validationResult.success) {
        throw createApiError.badRequest(
          "Invalid skill data",
          validationResult.error.format()
        );
      }

      // Map the incoming 'proficiency' field to 'proficiencyLevel' for Prisma
      const skill = await prisma.skill.update({
        where: { id: params.id },
        data: {
          name: data.name,
          proficiencyLevel: data.proficiencyLevel,
          category: data.category,
        },
      });

      // Map back to frontend format
      return successResponse({
        id: skill.id,
        name: skill.name,
        proficiency: skill.proficiencyLevel,
        category: skill.category,
      });
    } catch (error) {
      return handleApiError(error);
    }
  },
  "skill"
);

// DELETE a skill
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.skill.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "Skill deleted successfully" });
    } catch (error) {
      return handleApiError(error);
    }
  },
  "skill"
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
      const validationResult = skillUpdateSchema.safeParse(data);

      if (!validationResult.success) {
        return errorResponse(
          "Invalid skill data: " +
            JSON.stringify(validationResult.error.format()),
          400
        );
      }

      // Create the new skill
      const skill = await prisma.skill.create({
        data: {
          name: validationResult.data.name,
          category: validationResult.data.category,
          proficiencyLevel: validationResult.data.proficiencyLevel || 1,
          userId: userId,
        },
      });

      return successResponse(skill);
    } catch (error) {
      console.error("Error creating skill:", error);

      if (error instanceof z.ZodError) {
        return errorResponse(
          "Validation error: " + JSON.stringify(error.format()),
          400
        );
      }

      if (error instanceof Error) {
        return errorResponse(`Failed to create skill: ${error.message}`, 500);
      }

      return errorResponse("Failed to create skill", 500);
    }
  }
);
