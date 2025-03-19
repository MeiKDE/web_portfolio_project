import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { experienceSchema } from "@/lib/validations";

// GET all experiences for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse(401, "Not authenticated");
    }

    const experiences = await prisma.experience.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return successResponse(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return errorResponse(500, "Failed to fetch experiences");
  }
}

// POST new experience
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse(401, "Not authenticated");
    }

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
        400,
        "Invalid experience data: " +
          JSON.stringify(validationResult.error.format())
      );
    }

    const newExperience = await prisma.experience.create({
      data: {
        ...validationResult.data,
        userId: session.user.id,
      },
    });

    return successResponse(newExperience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return errorResponse(500, "Failed to create experience");
  }
}
