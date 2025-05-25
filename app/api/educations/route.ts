// -----------------------------------------------------
// GET /api/educations - Get all educations for the current user
// POST /api/educations - Create a new education item
// -----------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { educationSchema } from "@/app/hooks/validations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import { withAuth } from "@/app/lib/api/api-helpers";

// GET all educations for the current user
export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    const educations = await prisma.education.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startYear: "desc",
      },
    });

    return NextResponse.json(educations);
  } catch (error) {
    console.error("Error fetching educations:", error);
    return NextResponse.json(
      { error: "Failed to fetch educations" },
      { status: 500 }
    );
  }
});

// CREATE a new education
export const POST = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate the request body using educationSchema
  const validationResult = educationSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.errors[0].message },
      { status: 400 }
    );
  }

  const { institution, degree, fieldOfStudy, startYear, endYear, description } =
    validationResult.data;

  const education = await prisma.education.create({
    data: {
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear: endYear || new Date().getFullYear(),
      description,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(education);
};
