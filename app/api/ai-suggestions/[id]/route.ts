//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, successResponse, errorResponse } from "@/lib/api-helpers";

// UPDATE an AI suggestion (e.g., accept, reject, regenerate)
export const PUT = withAuth(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user: any
  ) => {
    try {
      const { status } = await request.json();

      // First, check if the suggestion belongs to the authenticated user
      const suggestion = await prisma.aISuggestion.findUnique({
        where: { id: params.id },
        include: { user: true },
      });

      if (!suggestion || suggestion.userId !== user.id) {
        return errorResponse("Not authorized to update this suggestion", 403);
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
      console.error("Error updating AI suggestion:", error);
      return errorResponse("Failed to update AI suggestion");
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
            proficiencyLevel: "Beginner", // Default value
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
        return errorResponse("Not authorized to delete this suggestion", 403);
      }

      await prisma.aISuggestion.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "AI suggestion deleted successfully" });
    } catch (error) {
      console.error("Error deleting AI suggestion:", error);
      return errorResponse("Failed to delete AI suggestion");
    }
  }
);
