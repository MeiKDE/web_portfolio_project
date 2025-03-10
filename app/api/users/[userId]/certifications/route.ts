//Summary
// This file (certifications/route.ts) is focused on getting all certifications for a user.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { certificationSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all certifications for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const certifications = await prisma.certification.findMany({
      where: { userId: params.userId },
      orderBy: { issueDate: "desc" },
    });

    return successResponse(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return errorResponse("Failed to fetch certifications");
  }
}

// CREATE a new certification
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    console.log("Received certification data:", data);

    // Validate the incoming data
    const validationResult = certificationSchema.safeParse(data);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.format());
      return errorResponse(
        "Invalid certification data",
        400,
        validationResult.error.format()
      );
    }

    // Create the certification in the database
    const certification = await prisma.certification.create({
      data: {
        ...validationResult.data,
        userId: params.userId,
      },
    });

    return successResponse(certification, 201);
  } catch (error) {
    console.error("Error creating certification:", error);

    if (error instanceof Error) {
      return errorResponse(`Failed to create certification: ${error.message}`);
    }

    return errorResponse("Failed to create certification");
  }
}
