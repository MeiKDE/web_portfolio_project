//Summary
// This file (route.ts) is focused on creating new education entries.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/api-helpers";

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
  userId: z.string().min(1, "User ID is required"),
});

// CREATE a new education entry
export async function POST(request: NextRequest) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    // Parse the request body
    const body = await request.json();

    // Get the user ID and email from the session
    const sessionUserId = (session.user as any).id;
    const email = session.user.email;

    console.log("User ID from session:", sessionUserId);
    console.log("User email from session:", email);

    // Check if the user exists in the database
    let user = await prisma.user.findUnique({
      where: { id: sessionUserId },
    });

    // If user doesn't exist by ID, try to find by email
    if (!user && email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    }

    // If user still doesn't exist, create a new user
    if (!user && email) {
      console.log("Creating new user with ID:", sessionUserId);
      user = await prisma.user.create({
        data: {
          id: sessionUserId,
          email,
          name: session.user.name || email.split("@")[0],
          title: "",
          location: "",
          bio: "",
        },
      });
      console.log("Created new user:", user);
    }

    if (!user) {
      console.error(`Could not find or create user with ID ${sessionUserId}`);
      return errorResponse("User not found and could not be created", 500);
    }

    console.log("Using user:", user.id);

    // Validate the request data
    const validatedData = educationSchema.parse({
      ...body,
      userId: user.id, // Use the verified user ID from the database
    });

    // Ensure endYear is provided (required by Prisma schema)
    const dataWithEndYear = {
      ...validatedData,
      // If endYear is not provided, use a default value (e.g., startYear + 4)
      endYear: validatedData.endYear || validatedData.startYear + 4,
    };

    console.log("Creating education with data:", dataWithEndYear);

    // Create the new education entry
    const education = await prisma.education.create({
      data: dataWithEndYear,
    });

    console.log("Created education:", education);
    return successResponse(education, 201);
  } catch (error) {
    console.error("Error creating education entry:", error);

    // More detailed error handling
    if (error instanceof z.ZodError) {
      return errorResponse("Validation error", 400, error.errors);
    }

    // Check for Prisma errors
    if (error.code) {
      return errorResponse("Database error", 500, {
        code: error.code,
        message: error.message,
        meta: error.meta,
      });
    }

    return errorResponse("Failed to create education entry", 500, {
      message: error.message,
    });
  }
}
