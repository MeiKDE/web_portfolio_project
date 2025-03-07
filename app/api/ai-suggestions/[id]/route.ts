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
      });

      if (!suggestion || suggestion.userId !== user.id) {
        return errorResponse("Not authorized to update this suggestion", 403);
      }

      const aiSuggestion = await prisma.aISuggestion.update({
        where: { id: params.id },
        data: { status },
      });

      // If the suggestion was accepted, you might want to apply the suggestion
      // to the target entity (experience, skill, etc.)
      if (status === "accepted" && aiSuggestion.targetId) {
        // This would depend on the type of suggestion and target
        // For example, if it's a skill suggestion:
        if (
          aiSuggestion.targetType === "skill" &&
          aiSuggestion.suggestion.includes("Add")
        ) {
          // Extract the skill name from the suggestion
          const skillName = aiSuggestion.suggestion
            .split("Add ")[1]
            .split(" to")[0];
          // console.log(`ln28: skillName: ${skillName}`);

          // Check if the skill already exists
          const existingSkill = await prisma.skill.findFirst({
            where: {
              userId: aiSuggestion.userId,
              name: skillName,
            },
          });
          // console.log(`ln30: existingSkill: ${existingSkill}`);
          // If not, create it
          if (!existingSkill) {
            await prisma.skill.create({
              data: {
                name: skillName,
                userId: aiSuggestion.userId,
              },
            });
          }
        }
        // Similar logic for other target types
      }

      return successResponse(aiSuggestion);
    } catch (error) {
      console.error("Error updating AI suggestion:", error);
      return errorResponse("Failed to update AI suggestion");
    }
  }
);

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
