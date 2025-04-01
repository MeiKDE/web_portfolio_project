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
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import { handleApiError } from "@/app/lib/api/error-handler";

// Define schema for validation
const skillUpdateSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
  proficiencyLevel: z.number().int().min(1).max(5).default(1),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const data = await req.json();

    console.log("params.id:", params.id);

    // Validate the incoming data using skillSchema
    const validationResult = skillUpdateSchema.safeParse(data);
    if (!validationResult.success) {
      return errorResponse(
        `Validation failed: ${JSON.stringify(validationResult.error.format())}`,
        400
      );
    }

    // Verify skill ownership
    const existingSkill = await prisma.skill.findUnique({
      where: { id: params.id },
    });

    if (!existingSkill) {
      return errorResponse("Skill not found", 404);
    }

    console.log("Session user:", session.user);
    console.log("Existing skill:", existingSkill);

    console.log("Session user ID:", session.user.id);
    console.log("Existing skill user ID:", existingSkill.userId);
    console.log("Existing skill ID:", existingSkill.id);

    // Compare the session user's ID with the skill's userId
    if (existingSkill.userId !== session.user.id) {
      return errorResponse("Not authorized to update this skill", 403);
    }

    // Update the skill
    const updatedSkill = await prisma.skill.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    return successResponse(updatedSkill);
  } catch (error) {
    console.error("Error in PUT /api/skills/[id]:", error);
    return handleApiError(error);
  }
}

// DELETE a skill
export const DELETE = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      // First verify the skill exists and belongs to the user
      const skill = await prisma.skill.findUnique({
        where: { id: params.id },
        select: { id: true, userId: true },
      });

      if (!skill) {
        return errorResponse("Skill not found", 404);
      }

      if (skill.userId !== user.id) {
        return errorResponse("Not authorized to delete this skill", 403);
      }

      const deletedSkill = await prisma.skill.delete({
        where: { id: params.id },
      });

      return successResponse({
        message: "Skill deleted successfully",
        deletedSkill,
      });
    } catch (error) {
      return handleApiError(error);
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

// GET all skills for a specific user
export const GET = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      console.log("Fetching skills for user:", params.userId);
      const userId = params.userId;

      // Fetch the skills for the specified user
      const skills = await prisma.skill.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return successResponse(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);

      if (error instanceof Error) {
        return errorResponse(`Failed to fetch skills: ${error.message}`, 500);
      }

      return errorResponse("Failed to fetch skills", 500);
    }
  }
);
