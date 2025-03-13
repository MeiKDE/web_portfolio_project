//Summary
// This file (skills/route.ts) is focused on getting all skills for a user.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";
import { z } from "zod";

// Define validation schema for skills
const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
  proficiencyLevel: z.number().int().min(1).max(5).optional(),
});

// GET skills for a specific user
export const GET = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      const userId = params.userId;

      // Fetch the skills for the specified user
      const skills = await prisma.skill.findMany({
        where: { userId: userId },
        orderBy: { name: "asc" },
      });

      return successResponse(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);

      if (error instanceof Error) {
        return errorResponse(`Failed to fetch skills: ${error.message}`);
      }

      return errorResponse("Failed to fetch skills");
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
      const validationResult = skillSchema.safeParse(data);

      if (!validationResult.success) {
        return errorResponse(
          "Invalid skill data",
          400,
          validationResult.error.format()
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

      return successResponse(skill, 201);
    } catch (error) {
      console.error("Error creating skill:", error);

      if (error instanceof z.ZodError) {
        return errorResponse("Validation error", 400, error.format());
      }

      if (error instanceof Error) {
        return errorResponse(`Failed to create skill: ${error.message}`);
      }

      return errorResponse("Failed to create skill");
    }
  }
);
