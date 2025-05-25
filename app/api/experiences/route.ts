import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { experienceSchema } from "@/app/hooks/validations";
import { withAuth } from "@/app/lib/api/api-helpers";

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

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
});

// -----------------------------------------------------
// POST /api/experiences - Create a new experience item
// -----------------------------------------------------

// CREATE a new experience
export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    const body = await request.json();

    // Handle field mapping from frontend to backend
    const mappedBody = {
      company: body.company || body.companyName,
      position: body.position,
      startDate: body.startDate,
      endDate: body.endDate,
      location: body.location,
      description: body.description,
      isCurrentPosition: body.isCurrentPosition || false,
    };

    // Validate the request body using experienceSchema
    const validationResult = experienceSchema.safeParse(mappedBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      company,
      position,
      startDate,
      endDate,
      location,
      description,
      isCurrentPosition,
    } = validationResult.data;

    // Convert string dates to Date objects for database
    const startDateObj = new Date(startDate);
    const endDateObj = endDate ? new Date(endDate) : null;

    // Validate dates
    if (isNaN(startDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid start date format" },
        { status: 400 }
      );
    }

    if (endDate && endDateObj && isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid end date format" },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        startDate: startDateObj,
        endDate: endDateObj,
        location,
        description,
        isCurrentPosition,
        userId: user.id,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
});
