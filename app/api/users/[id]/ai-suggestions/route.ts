//Summary
// This file (generate/route.ts) is focused on creating new suggestions based on user input.

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { successResponse, errorResponse } from "@/app/lib/api/api-helpers";

// GET all AI suggestions for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const aiSuggestions = await prisma.aISuggestion.findMany({
      where: {
        userId: params.id,
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
