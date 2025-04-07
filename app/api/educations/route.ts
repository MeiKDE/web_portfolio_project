// Create new skill
// Create new certification
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withAuth,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { z } from "zod";
import { handleApiError } from "@/app/lib/api/error-handler";

// Define schema for validation
const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100),
  description: z.string().optional(),
});

// CREATE a new education entry
export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    const data = await request.json();

    // Validate the data
    const validationResult = educationSchema.safeParse(data);

    if (!validationResult.success) {
      return errorResponse(
        "Invalid education data: " +
          JSON.stringify(validationResult.error.format()),
        400
      );
    }

    const education = await prisma.education.create({
      data: {
        ...validationResult.data,
        userId: user.id,
      },
    });

    return successResponse(education);
  } catch (error) {
    return handleApiError(error);
  }
});
