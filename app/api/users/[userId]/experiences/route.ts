// GET Request: Imagine you want to see all the jobs a user has had. You send a GET request to this route with the user's ID, and it returns a list of all their jobs.
// This file (experiences/route.ts) is focused on getting all experiences for a user from the database.
// If successful, it sends back the list of experiences as a JSON response.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";
import { experienceSchema } from "@/lib/validations";

// GET all experiences for a user
export const GET = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      const experiences = await prisma.experience.findMany({
        where: { userId: params.userId },
        orderBy: { startDate: "desc" },
      });

      return successResponse(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      return errorResponse("Failed to fetch experiences");
    }
  }
);

// POST Request: If you want to add a new job to a user's profile, you send a POST request with the job details, and it adds this job to the user's list of experiences.
// When a POST request is made, it expects some data in the request body (like the job position, company, start date, etc.).
// If successful, it sends back the newly created experience as a JSON response.
export const POST = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { userId: string } },
    user
  ) => {
    try {
      // Add detailed logging
      console.log("POST request to experiences");
      console.log("User from session:", user);
      console.log("User ID from params:", params.userId);

      // Verify the user is modifying their own data
      if (user.id !== params.userId) {
        console.log("User ID mismatch - Forbidden");
        return errorResponse("Forbidden", 403);
      }

      // Parse and validate the request body
      const body = await request.json();
      console.log("Received body:", body);

      const validationResult = experienceSchema.safeParse(body);

      if (!validationResult.success) {
        console.log("Validation errors:", validationResult.error.format());
        return errorResponse(
          "Invalid experience data",
          400,
          validationResult.error.format()
        );
      }

      // Create the new experience
      const newExperience = await prisma.experience.create({
        data: {
          ...validationResult.data,
          description: validationResult.data.description || "",
          userId: params.userId,
        },
      });

      return successResponse(newExperience, 201);
    } catch (error) {
      console.error("Error creating experience:", error);
      return errorResponse("Failed to create experience");
    }
  }
);
