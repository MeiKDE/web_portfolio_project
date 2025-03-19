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
    const { userId } = params;

    const certifications = await prisma.certification.findMany({
      where: {
        userId,
      },
      orderBy: {
        issueDate: "desc",
      },
    });

    // Return a proper response using the helper function
    return NextResponse.json(successResponse(certifications));
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(errorResponse("Failed to fetch certifications"), {
      status: 500,
    });
  }
}

// CREATE a new certification
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    // Verify the user is adding to their own profile or is an admin
    if (params.userId !== session.user.id && !(session.user as any).isAdmin) {
      return NextResponse.json(
        errorResponse("Unauthorized access to this user's certifications"),
        { status: 403 }
      );
    }

    const data = await request.json();
    console.log("Received certification data:", data);

    // Validate the incoming data
    const validationResult = certificationSchema.safeParse(data);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.format());
      return NextResponse.json(errorResponse("Invalid certification data"), {
        status: 400,
      });
    }

    // Create the certification in the database
    const certification = await prisma.certification.create({
      data: {
        ...validationResult.data,
        userId: params.userId,
      },
    });

    return NextResponse.json(successResponse(certification));
  } catch (error) {
    console.error("Error creating certification:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        errorResponse(`Failed to create certification: ${error.message}`),
        { status: 500 }
      );
    }

    return NextResponse.json(errorResponse("Failed to create certification"), {
      status: 500,
    });
  }
}
