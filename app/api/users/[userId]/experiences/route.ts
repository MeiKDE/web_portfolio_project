// GET Request: Imagine you want to see all the jobs a user has had. You send a GET request to this route with the user's ID, and it returns a list of all their jobs.
// This file (experiences/route.ts) is focused on getting all experiences for a user from the database.
// If successful, it sends back the list of experiences as a JSON response.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";
import { z } from "zod"; // You would need to install zod for validation

// Define a schema for experience data validation
const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  description: z.string().min(1, "Description is required"),
  isCurrentPosition: z.boolean().optional().default(false),
  // Add other fields as needed
});

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
      // Verify the user is modifying their own data
      if (user.id !== params.userId) {
        return errorResponse("Forbidden", 403);
      }

      // Parse and validate the request body
      const body = await request.json();
      const validationResult = experienceSchema.safeParse(body);

      if (!validationResult.success) {
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
