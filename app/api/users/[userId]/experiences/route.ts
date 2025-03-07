// GET Request: Imagine you want to see all the jobs a user has had. You send a GET request to this route with the user's ID, and it returns a list of all their jobs.
// This file (experiences/route.ts) is focused on getting all experiences for a user from the database.
// If successful, it sends back the list of experiences as a JSON response.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // The console.log lines are commented out, which is fine for production
    // but inconsistent with the logging approach in the catch block

    const experiences = await prisma.experience.findMany({
      where: { userId: params.userId },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST Request: If you want to add a new job to a user's profile, you send a POST request with the job details, and it adds this job to the user's list of experiences.
// When a POST request is made, it expects some data in the request body (like the job position, company, start date, etc.).
// If successful, it sends back the newly created experience as a JSON response.
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);

    console.log(
      "POST /api/users/[userId]/experiences - Session:",
      JSON.stringify(session)
    );
    console.log("User ID from params:", params.userId);

    if (!session || !session.user) {
      console.log("No session or user, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session user:", session.user);

    // Verify the user is modifying their own data
    if ((session.user as any).id !== params.userId) {
      console.log("Session user ID:", (session.user as any).id);
      console.log("Params user ID:", params.userId);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse the request body
    const { position, company, startDate, endDate, description } =
      await request.json();

    // Create the new experience
    const newExperience = await prisma.experience.create({
      data: {
        position,
        company,
        startDate,
        endDate,
        description,
        userId: params.userId,
      },
    });

    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
