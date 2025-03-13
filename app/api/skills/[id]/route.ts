//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withOwnership, successResponse } from "@/lib/api-helpers";
import { handleApiError, createApiError } from "@/lib/error-handler";
import { z } from "zod";

// Define schema for validation
const skillUpdateSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiencyLevel: z.number().int().min(1).max(5),
  category: z.string().optional(),
});

// UPDATE a skill
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      // Validate the data
      const validationResult = skillUpdateSchema.safeParse(data);

      if (!validationResult.success) {
        throw createApiError.badRequest(
          "Invalid skill data",
          validationResult.error.format()
        );
      }

      // Map the incoming 'proficiency' field to 'proficiencyLevel' for Prisma
      const skill = await prisma.skill.update({
        where: { id: params.id },
        data: {
          name: data.name,
          proficiencyLevel: data.proficiencyLevel,
          category: data.category,
        },
      });

      // Map back to frontend format
      return successResponse({
        id: skill.id,
        name: skill.name,
        proficiency: skill.proficiencyLevel,
        category: skill.category,
      });
    } catch (error) {
      return handleApiError(
        error,
        "Failed to update skill",
        "PUT /skills/[id]"
      );
    }
  },
  "skill"
);

// DELETE a skill
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.skill.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "Skill deleted successfully" });
    } catch (error) {
      return handleApiError(
        error,
        "Failed to delete skill",
        "DELETE /skills/[id]"
      );
    }
  },
  "skill"
);
