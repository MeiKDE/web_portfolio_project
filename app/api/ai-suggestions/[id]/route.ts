//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withAuth,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { handleApiError, createApiError } from "@/app/lib/api/error-handler";
import { z } from "zod";

// Define validation schema for suggestion updates
const suggestionUpdateSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "regenerated"]),
});

// UPDATE an AI suggestion (e.g., accept, reject, regenerate)
export const PUT = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user: any
  ) => {
    try {
      const data = await request.json();

      // Validate the data
      const validationResult = suggestionUpdateSchema.safeParse(data);

      if (!validationResult.success) {
        throw createApiError.badRequest(
          "Invalid suggestion data",
          validationResult.error.format()
        );
      }

      const { status } = validationResult.data;

      // First, check if the suggestion belongs to the authenticated user
      const suggestion = await prisma.aISuggestion.findUnique({
        where: { id: params.id },
        include: { user: true },
      });

      if (!suggestion || suggestion.userId !== user.id) {
        throw createApiError.forbidden(
          "Not authorized to update this suggestion"
        );
      }

      const aiSuggestion = await prisma.aISuggestion.update({
        where: { id: params.id },
        data: { status },
      });

      // If the suggestion was accepted, apply the suggestion based on type
      if (status === "accepted" && aiSuggestion.targetId) {
        await handleAcceptedSuggestion(aiSuggestion, user.id);
      }

      return successResponse(aiSuggestion);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

// Helper function to handle different types of accepted suggestions
async function handleAcceptedSuggestion(suggestion: any, userId: string) {
  try {
    if (
      suggestion.targetType === "skill" &&
      suggestion.suggestion.includes("Add")
    ) {
      // Extract the skill name from the suggestion
      const skillName = suggestion.suggestion.split("Add ")[1].split(" to")[0];

      // Check if the skill already exists
      const existingSkill = await prisma.skill.findFirst({
        where: {
          userId: suggestion.userId,
          name: skillName,
        },
      });

      // If not, create it
      if (!existingSkill) {
        await prisma.skill.create({
          data: {
            name: skillName,
            userId: suggestion.userId,
            proficiencyLevel: 1, // Using the backend field name directly
          },
        });
      }
    }
    // Add handlers for other target types as needed
  } catch (error) {
    console.error("Error handling accepted suggestion:", error);
  }
}

// DELETE an AI suggestion
export const DELETE = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user: any
  ) => {
    try {
      // First, check if the suggestion belongs to the authenticated user
      const suggestion = await prisma.aISuggestion.findUnique({
        where: { id: params.id },
      });

      if (!suggestion || suggestion.userId !== user.id) {
        throw createApiError.forbidden(
          "Not authorized to delete this suggestion"
        );
      }

      await prisma.aISuggestion.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "AI suggestion deleted successfully" });
    } catch (error) {
      return handleApiError(error);
    }
  }
);

// Generate a new AI suggestion
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const aiSuggestion = await prisma.aISuggestion.create({
      data: {
        targetType,
        targetId,
        suggestion,
        status: "pending",
        userId: params.id,
      },
    });

    return successResponse(aiSuggestion);
  } catch (error) {
    console.error("Error generating AI suggestion:", error);
    return errorResponse("Failed to generate AI suggestion");
  }
}
