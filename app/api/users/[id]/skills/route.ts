//Summary
// This file (skills/route.ts) is focused on getting all skills for a user.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withAuth,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
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
