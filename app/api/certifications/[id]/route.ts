//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { certificationSchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET a single certification
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certification = await prisma.certification.findUnique({
      where: { id: params.id },
    });

    if (!certification) {
      return errorResponse("Certification not found", 404);
    }

    return successResponse(certification);
  } catch (error) {
    console.error("Error fetching certification:", error);
    return errorResponse("Failed to fetch certification");
  }
}

// UPDATE a certification
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const certificationCheck = await prisma.certification.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    // Verify the user owns this certification or is an admin
    if (
      !certificationCheck ||
      (certificationCheck.userId !== session.user.id &&
        !(session.user as any).isAdmin)
    ) {
      return errorResponse("Unauthorized access to this certification", 403);
    }

    const data = await request.json();
    console.log("Updating certification with data:", data);

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

    // Update the certification in the database
    const updatedCertification = await prisma.certification.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    return successResponse(updatedCertification);
  } catch (error) {
    console.error("Error updating certification:", error);

    if (error instanceof Error) {
      return errorResponse(`Failed to update certification: ${error.message}`);
    }

    return errorResponse("Failed to update certification");
  }
}

// DELETE a certification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    const certification = await prisma.certification.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    // Verify the user owns this certification or is an admin
    if (
      !certification ||
      (certification.userId !== session.user.id &&
        !(session.user as any).isAdmin)
    ) {
      return errorResponse("Unauthorized access to this certification", 403);
    }

    // Delete the certification from the database
    await prisma.certification.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Certification deleted successfully" });
  } catch (error) {
    console.error("Error deleting certification:", error);

    if (error instanceof Error) {
      return errorResponse(`Failed to delete certification: ${error.message}`);
    }

    return errorResponse("Failed to delete certification");
  }
}
