//Summary
// This file (skills/route.ts) is focused on getting all skills for a user.

import { NextRequest, NextResponse } from "next/server";
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
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(successResponse(skills));
    } catch (error) {
      console.error("Error fetching skills:", error);

      if (error instanceof Error) {
        return NextResponse.json(
          errorResponse(`Failed to fetch skills: ${error.message}`),
          { status: 500 }
        );
      }

      return NextResponse.json(errorResponse("Failed to fetch skills"), {
        status: 500,
      });
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
        return NextResponse.json(errorResponse("Forbidden"), { status: 403 });
      }

      // Get the skill data from the request
      const data = await request.json();

      // Validate the data
      const validationResult = skillSchema.safeParse(data);

      if (!validationResult.success) {
        return NextResponse.json(
          errorResponse(
            "Invalid skill data: " +
              JSON.stringify(validationResult.error.format())
          ),
          { status: 400 }
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

      return NextResponse.json(successResponse(skill));
    } catch (error) {
      console.error("Error creating skill:", error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          errorResponse("Validation error: " + JSON.stringify(error.format())),
          { status: 400 }
        );
      }

      if (error instanceof Error) {
        return NextResponse.json(
          errorResponse(`Failed to create skill: ${error.message}`),
          { status: 500 }
        );
      }

      return NextResponse.json(errorResponse("Failed to create skill"), {
        status: 500,
      });
    }
  }
);
