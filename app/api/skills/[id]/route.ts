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

// Define schema for validation
const skillUpdateSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiencyLevel: z.number().int().min(1).max(5),
  category: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const { userId, id } = params;
    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.category || !data.proficiencyLevel) {
      return errorResponse("Missing required fields", 400);
    }

    // Update the skill
    const updatedSkill = await prisma.skill.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        name: data.name,
        category: data.category,
        proficiencyLevel: data.proficiencyLevel,
      },
    });

    return successResponse(updatedSkill);
  } catch (error) {
    console.error("Error updating skill:", error);
    return errorResponse("Failed to update skill", 500);
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
      const skillId = params.id;
      console.log("Attempting to delete skill:", {
        skillId,
        userId: user.id,
      });

      // First, check if the skill exists
      const skill = await prisma.skill.findUnique({
        where: { id: skillId },
        select: {
          id: true,
          userId: true,
        },
      });

      console.log("Found skill:", skill);

      if (!skill) {
        console.log("Skill not found in database");
        return errorResponse("Skill not found", 404);
      }

      // Check if the skill belongs to the authenticated user
      if (skill.userId !== user.id) {
        console.log("Unauthorized: skill belongs to different user", {
          skillUserId: skill.userId,
          requestingUserId: user.id,
        });
        return errorResponse("Unauthorized to delete this skill", 403);
      }

      // Delete the skill
      const deletedSkill = await prisma.skill.delete({
        where: { id: skillId },
      });

      console.log("Successfully deleted skill:", deletedSkill);

      return successResponse({
        message: "Skill deleted successfully",
        deletedSkill,
      });
    } catch (error) {
      console.error("Error in DELETE /api/skills/[id]:", error);
      return errorResponse(
        error instanceof Error ? error.message : "Failed to delete skill",
        500
      );
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
