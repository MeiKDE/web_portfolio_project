//Summary
// This file (skills/route.ts) is focused on getting all skills for a user.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";

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

      // Map proficiencyLevel (backend) to proficiency (frontend) for consistency
      const mappedSkills = skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        proficiency: skill.proficiencyLevel,
        category: skill.category,
      }));

      return successResponse(mappedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
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

      // Validate that name is provided
      if (!data.name || data.name.trim() === "") {
        return errorResponse("Skill name is required", 400);
      }

      // Create the new skill
      const skill = await prisma.skill.create({
        data: {
          name: data.name,
          category: data.category,
          proficiencyLevel: data.proficiency,
          userId: userId,
        },
      });

      return successResponse(skill, 201);
    } catch (error) {
      console.error("Error creating skill:", error);
      return errorResponse("Failed to create skill");
    }
  }
);
