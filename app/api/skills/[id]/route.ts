//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { skillSchema } from "@/app/hooks/validations";
import {
  withOwnership,
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";

// GET a single skill
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const data = await prisma.skill.findUnique({
      where: { id: params.id },
    });

    if (!data) {
      return errorResponse("Skill not found");
    }

    // Use imported skillSchema instead
    const validationResult = skillSchema.safeParse(data);

    if (!validationResult.success) {
      return errorResponse("Invalid skill data in database");
    }

    return successResponse(validationResult.data);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Failed to fetch skill",
      500
    );
  }
};

// UPDATE a skill
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      // Validate the incoming data
      const validationResult = skillSchema.safeParse(data);

      if (!validationResult.success) {
        return errorResponse(
          "Invalid skill data",
          400,
          validationResult.error.format()
        );
      }

      const updatedSkill = await prisma.skill.update({
        where: { id: params.id },
        data: validationResult.data,
      });

      return successResponse(updatedSkill);
    } catch (error) {
      return errorResponse(
        error instanceof Error ? error.message : "Failed to update skill",
        500
      );
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
      return errorResponse(
        error instanceof Error ? error.message : "Failed to delete skill",
        500
      );
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
      const validationResult = skillSchema.safeParse(data);

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

      if (error instanceof Error) {
        return errorResponse(`Failed to create skill: ${error.message}`, 500);
      }

      return errorResponse("Failed to create skill", 500);
    }
  }
);
