//Summary
// This file ([id]/route.ts) is focused on managing existing skills (updating and deleting).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// UPDATE a skill
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Map the incoming 'proficiency' field to 'proficiencyLevel' for Prisma
    const prismaData = {
      name: data.name,
      proficiencyLevel: data.proficiency, // Map to the correct field name
      category: data.category,
    };

    const skill = await prisma.skill.update({
      where: { id: params.id },
      data: prismaData,
    });

    // Map back to frontend format
    const mappedSkill = {
      id: skill.id,
      name: skill.name,
      proficiencyLevel: skill.proficiencyLevel,
      category: skill.category,
    };

    return NextResponse.json(mappedSkill);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
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

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
