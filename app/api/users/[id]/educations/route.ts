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

// Define validation schema for education
const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100),
  description: z.string().optional(),
});

// GET skills for a specific user
export const GET = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      console.log("Fetching education for user:", params.userId);
      const userId = params.userId;

      // Fetch the education for the specified user
      const education = await prisma.education.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return successResponse(education);
    } catch (error) {
      console.error("Error fetching education:", error);

      if (error instanceof Error) {
        return errorResponse(`Failed to fetch skills: ${error.message}`, 500);
      }

      return errorResponse("Failed to fetch education", 500);
    }
  }
);

// GET education records for a specific user
export const GETEducation = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      console.log("Fetching education for user:", params.userId);
      const userId = params.userId;

      // Fetch the education records for the specified user
      const education = await prisma.education.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          startYear: "desc",
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
