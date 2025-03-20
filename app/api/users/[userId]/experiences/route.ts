// GET Request: Imagine you want to see all the jobs a user has had. You send a GET request to this route with the user's ID, and it returns a list of all their jobs.
// This file (experiences/route.ts) is focused on getting all experiences for a user from the database.
// If successful, it sends back the list of experiences as a JSON response.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse, withAuth } from "@/lib/api-helpers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { experienceSchema } from "@/lib/validations";

// GET all experiences for a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse("Not authenticated", 401);
    }

    // For security, only allow users to see their own experiences
    // or implement admin check here if needed
    if (session.user.id !== params.userId) {
      return errorResponse("Not authorized to view these experiences", 403);
    }

    const experiences = await prisma.experience.findMany({
      where: {
        userId: params.userId,
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
}

// POST Request: If you want to add a new job to a user's profile, you send a POST request with the job details, and it adds this job to the user's list of experiences.
// When a POST request is made, it expects some data in the request body (like the job position, company, start date, etc.).
// If successful, it sends back the newly created experience as a JSON response.

// POST new experience for a specific user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse("Not authenticated", 401);
    }

    // For security, only allow users to add experiences to their own profile
    if (session.user.id !== params.userId) {
      return errorResponse(
        "Not authorized to add experiences for this user",
        403
      );
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
      return errorResponse("Invalid experience data", 400);
    }

    const newExperience = await prisma.experience.create({
      data: {
        ...validationResult.data,
        userId: params.userId,
      },
    });

    return successResponse(newExperience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return errorResponse("Failed to create experience", 500);
  }
}
