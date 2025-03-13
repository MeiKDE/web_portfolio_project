//Summary
// This file (route.ts) is focused on creating new education entries.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse } from "@/lib/api-helpers";
import { z } from "zod";
import {
  handleApiError,
  createApiError,
  HTTP_STATUS,
} from "@/lib/error-handler";

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

// CREATE a new education entry
export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request data
    const validationResult = educationSchema.safeParse(body);

    if (!validationResult.success) {
      throw createApiError.badRequest(
        "Invalid education data",
        validationResult.error.format()
      );
    }

    // Ensure endYear is provided (required by Prisma schema)
    const dataWithEndYear = {
      ...validationResult.data,
      // If endYear is not provided, use a default value (e.g., startYear + 4)
      endYear:
        validationResult.data.endYear || validationResult.data.startYear + 4,
      userId: user.id,
    };

    // Create the new education entry
    const education = await prisma.education.create({
      data: dataWithEndYear,
    });

    return successResponse(education, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(
      error,
      "Failed to create education entry",
      "POST /education"
    );
  }
});
