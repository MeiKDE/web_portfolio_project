//Summary
// This file ([id]/route.ts) is focused on managing existing education entries (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// UPDATE an education entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    // Get the education entry to check ownership
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!existingEducation) {
      return errorResponse("Education entry not found", 404);
    }

    // Verify the user is modifying their own data
    if (existingEducation.userId !== (session.user as any).id) {
      return errorResponse("Forbidden", 403);
    }

    const data = await request.json();
    console.log("Updating education with data:", data);

    const education = await prisma.education.update({
      where: { id: params.id },
      data,
    });

    console.log("Updated education:", education);
    return successResponse(education);
  } catch (error) {
    console.error("Error updating education:", error);
    return errorResponse("Failed to update education");
  }
}

// DELETE an education entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse("Unauthorized", 401);
    }

    // Get the education entry to check ownership
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!existingEducation) {
      return errorResponse("Education entry not found", 404);
    }

    // Verify the user is modifying their own data
    if (existingEducation.userId !== (session.user as any).id) {
      return errorResponse("Forbidden", 403);
    }

    await prisma.education.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Education entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting education:", error);
    return errorResponse("Failed to delete education");
  }
}
