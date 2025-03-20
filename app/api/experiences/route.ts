import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, withAuth } from "@/lib/api-helpers";
import { experienceSchema } from "@/lib/validations";

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

// POST new experience
export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    const body = await request.json();

    // Convert date strings to Date objects
    if (body.startDate) {
      body.startDate = new Date(body.startDate);
    }
    if (body.endDate) {
      body.endDate = new Date(body.endDate);
    }

    const validationResult = experienceSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse(
        "Invalid experience data: " +
          JSON.stringify(validationResult.error.format()),
        400
      );
    }

    const newExperience = await prisma.experience.create({
      data: {
        ...validationResult.data,
        userId: user.id,
      },
    });

    return successResponse(newExperience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return errorResponse("Failed to create experience", 500);
  }
});
