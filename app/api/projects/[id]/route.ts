//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { errorResponse, successResponse } from "@/lib/api-helpers";

// UPDATE a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse("Unauthorized", 401);
    }

    // Get the project to check ownership
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return errorResponse("Project not found", 404);
    }

    // Verify the user is modifying their own data
    if (project.userId !== (session.user as any).id) {
      return errorResponse("Forbidden", 403);
    }

    const data = await request.json();

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data,
    });

    return successResponse(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return errorResponse("Failed to update project");
  }
}

// DELETE a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse("Unauthorized", 401);
    }

    // Get the project to check ownership
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return errorResponse("Project not found", 404);
    }

    // Verify the user is modifying their own data
    if (project.userId !== (session.user as any).id) {
      return errorResponse("Forbidden", 403);
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return errorResponse("Failed to delete project");
  }
}
