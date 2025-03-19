//Summary
// This file (education/route.ts) is focused on getting all education entries for a user.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";
import { handleApiError } from "@/lib/error-handler";

// GET all education entries for a specific user
export const GET = withAuth(
  async (request: NextRequest, { params }: { params: { userId: string } }) => {
    try {
      const educations = await prisma.education.findMany({
        where: { userId: params.userId },
        orderBy: { startYear: "desc" },
      });

      // No need to transform data anymore
      return NextResponse.json(successResponse(educations));
    } catch (error) {
      console.error("Error fetching education:", error);
      return NextResponse.json(errorResponse("Failed to fetch education"), {
        status: 500,
      });
    }
  }
);

// CREATE a new education entry for a specific user
export const POST = withAuth(
  async (request: NextRequest, { params }: { params: { userId: string } }) => {
    try {
      const data = await request.json();

      // No need to transform data anymore
      const education = await prisma.education.create({
        data: {
          ...data,
          userId: params.userId,
        },
      });

      return NextResponse.json(successResponse(education));
    } catch (error) {
      console.error("Error creating education:", error);
      return NextResponse.json(
        errorResponse("Failed to create education entry"),
        { status: 500 }
      );
    }
  }
);
