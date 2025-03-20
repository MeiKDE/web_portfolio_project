//Summary
// This file (projects/route.ts) is focused on getting all projects for a user.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// GET all projects for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: params.userId },
      orderBy: { updatedAt: "desc" },
    });

    return successResponse(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return errorResponse("Failed to fetch projects");
  }
}

// CREATE a new project
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    const project = await prisma.project.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return successResponse(201);
  } catch (error) {
    console.error("Error creating project:", error);
    return errorResponse("Failed to create project");
  }
}
