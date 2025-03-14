//Summary
// This file (education/route.ts) is focused on getting all education entries for a user.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// GET all education entries for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const education = await prisma.education.findMany({
      where: { userId: params.userId },
      orderBy: { endYear: "desc" },
    });

    return successResponse(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return errorResponse("Failed to fetch education");
  }
}

// CREATE a new education entry
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    const education = await prisma.education.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return successResponse(education);
  } catch (error) {
    console.error("Error creating education:", error);
    return errorResponse("Failed to create education");
  }
}
