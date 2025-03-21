import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withAuth,
  withOwnership,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { experienceSchema } from "@/app/hooks/validations";

// POST Request: If you want to add a new job to a user's profile, you send a POST request with the job details, and it adds this job to the user's list of experiences.
// When a POST request is made, it expects some data in the request body (like the job position, company, start date, etc.).
// If successful, it sends back the newly created experience as a JSON response.

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
    console.error("Error fetching experiences:", error);
    return errorResponse("Failed to fetch experiences", 500);
  }
});

// CREATE a new experience for the current user
export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    // Parse the request body
    const body = await request.json();
    console.log("Received data from client:", body);

    // Map client field names to match Prisma schema field names
    const experienceData = {
      position: body.position,
      company: body.companyName || body.company, // Accept either name
      location: body.location,
      startDate: body.startDate,
      endDate: body.endDate,
      description: body.description,
      isCurrentPosition: body.currentlyWorking || body.isCurrentPosition, // Accept either name
    };

    // Validate with our schema (which already matches Prisma field names)
    const validation = experienceSchema.safeParse(experienceData);

    if (!validation.success) {
      console.error("Validation error:", validation.error.format());
      return errorResponse(
        "Invalid experience data",
        400,
        validation.error.format()
      );
    }

    // Create record using Prisma schema field names
    const experience = await prisma.experience.create({
      data: {
        position: experienceData.position,
        company: experienceData.company,
        location: experienceData.location || null,
        startDate: new Date(experienceData.startDate), // Convert string to DateTime
        endDate: experienceData.endDate
          ? new Date(experienceData.endDate)
          : null,
        description: experienceData.description || null,
        isCurrentPosition: !!experienceData.isCurrentPosition,
        userId: user.id,
      },
    });

    console.log("Created experience:", experience);
    return successResponse(experience, "Experience created successfully", 201);
  } catch (error) {
    console.error("Error creating experience:", error);

    if (error instanceof Error) {
      return errorResponse(
        `Failed to create experience: ${error.message}`,
        500
      );
    }

    return errorResponse("Failed to create experience", 500);
  }
});
