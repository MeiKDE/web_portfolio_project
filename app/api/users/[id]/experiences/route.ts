// GET Request: Imagine you want to see all the jobs a user has had. You send a GET request to this route with the user's ID, and it returns a list of all their jobs.
// This file (experiences/route.ts) is focused on getting all experiences for a user from the database.
// If successful, it sends back the list of experiences as a JSON response.

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";
import { handleApiError } from "@/app/lib/api/error-handler";
import { experienceSchema } from "@/app/hooks/validations"; // Assuming you have this

// GET all experiences for the current user
export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    const experiences = await prisma.experience.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return successResponse(experiences);
  } catch (error) {
    return handleApiError(error);
  }
});

// CREATE a new experience for the current user
export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    const data = await request.json();

    // Validate the incoming data
    const validationResult = experienceSchema.safeParse(data);

    if (!validationResult.success) {
      return errorResponse(
        "Invalid experience data",
        400,
        validationResult.error.format()
      );
    }

    // Create the experience with the current user's ID
    const experience = await prisma.experience.create({
      data: {
        ...validationResult.data,
        userId: user.id, // Use the authenticated user's ID
      },
    });

    return successResponse(experience, "Experience created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
});
