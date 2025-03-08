// Summary
// This file (route.ts) is focused on creating new skills.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// CREATE a new skill
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Map the incoming 'proficiency' field to 'proficiencyLevel' for Prisma
    const prismaData = {
      name: data.name,
      proficiencyLevel: data.proficiency, // Map to the correct field name
      category: data.category,
      userId: data.userId,
    };

    const skill = await prisma.skill.create({
      data: prismaData,
    });

    // Map back to frontend format
    const mappedSkill = {
      id: skill.id,
      name: skill.name,
      proficiency: skill.proficiencyLevel,
      category: skill.category,
    };

    return NextResponse.json(mappedSkill);
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
