import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// GET all experiences
export async function GET(request: NextRequest) {
  try {
    const experiences = await prisma.experience.findMany();
    return successResponse(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return errorResponse("Failed to fetch experiences");
  }
}
