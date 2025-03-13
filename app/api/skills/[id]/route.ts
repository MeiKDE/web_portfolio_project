//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// UPDATE a skill
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Map the incoming 'proficiency' field to 'proficiencyLevel' for Prisma
    const skill = await prisma.skill.update({
      where: { id: params.id },
      data: {
        name: data.name,
        proficiencyLevel: data.proficiency, // Map from frontend's proficiency to DB's proficiencyLevel
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
    console.error("Error updating skill:", error);
    return errorResponse("Failed to update skill");
  }
}

// DELETE a skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.skill.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return errorResponse("Failed to delete skill");
  }
}
