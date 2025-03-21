//Summary
// This file (route.ts) is focused on creating new education entries.

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withAuth,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { z } from "zod";
import { handleApiError } from "@/app/lib/api/error-handler";

// Define the schema for education entries
const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startYear: z.number().int().positive("Start year must be a positive integer"),
  endYear: z
    .number()
    .int()
    .positive("End year must be a positive integer")
    .optional(),
  description: z.string().optional(),
});

// GET all education entries for the authenticated user
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const educations = await prisma.education.findMany({
      where: { userId: user.params.id },
      orderBy: { startYear: "desc" },
    });

    return successResponse(educations);
  } catch (error) {
    return handleApiError(error);
  }
});

// CREATE a new education entry
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const data = await request.json();

    const education = await prisma.education.create({
      data: {
        ...data,
        userId: user.params.id,
      },
    });

    return successResponse(education);
  } catch (error) {
    return handleApiError(error);
  }
});
