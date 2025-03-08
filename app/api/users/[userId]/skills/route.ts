//Summary
// This file (skills/route.ts) is focused on getting all skills for a user.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all skills for a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const skills = await prisma.skill.findMany({
      where: { userId: params.userId },
      orderBy: { updatedAt: "desc" },
    });

    // Map proficiencyLevel to proficiency for frontend consistency
    const mappedSkills = skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      proficiency: skill.proficiencyLevel,
      category: skill.category,
    }));

    return NextResponse.json(mappedSkills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// POST a new skill for a specific user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    // Map the incoming 'proficiency' field to 'proficiencyLevel' for Prisma
    const prismaData = {
      name: data.name,
      proficiencyLevel: data.proficiency, // Map to the correct field name
      category: data.category,
      userId: params.userId,
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
