//Summary
// This file (generate/route.ts) is focused on creating new suggestions based on user input.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// GET all AI suggestions for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const aiSuggestions = await prisma.aiSuggestion.findMany({
      where: {
        userId: params.userId,
        status: { not: "rejected" }, // Optionally filter out rejected suggestions
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(aiSuggestions);
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return errorResponse("Failed to fetch AI suggestions");
  }
}

// CREATE a new AI suggestion
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    const aiSuggestion = await prisma.aiSuggestion.create({
      data: {
        ...data,
        userId: params.userId,
        status: "pending",
      },
    });

    return successResponse(201);
  } catch (error) {
    console.error("Error creating AI suggestion:", error);
    return errorResponse("Failed to create AI suggestion");
  }
}
