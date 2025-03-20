//Summary
// The file is responsible for managing AI suggestions providing API endpoints to update and delete AI suggestions in a Next.js application.
// It includes logic to handle the implications of accepting suggestions, such as creating new skills based on the suggestions.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// Generate a new AI suggestion
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { targetType, targetId } = await request.json();

    // In a real application, you would call an AI service here
    // For now, we'll just create a mock suggestion
    let suggestion = "";

    switch (targetType) {
      case "experience":
        suggestion =
          "Consider adding more quantifiable achievements to this experience.";
        break;
      case "skill":
        suggestion = "Add Next.js to your skills based on your experience.";
        break;
      case "project":
        suggestion = "Add a GraphQL project to showcase your expertise.";
        break;
      case "tagline":
        suggestion =
          "Innovative problem-solver transforming complex challenges into elegant solutions.";
        break;
      default:
        suggestion = "Consider updating your profile with more details.";
    }

    const aiSuggestion = await prisma.aiSuggestion.create({
      data: {
        targetType,
        targetId,
        suggestion,
        status: "pending",
        userId: params.userId,
      },
    });

    return successResponse(201);
  } catch (error) {
    console.error("Error generating AI suggestion:", error);
    return errorResponse("Failed to generate AI suggestion");
  }
}
