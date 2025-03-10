//Summary
// This file (skills/route.ts) is focused on getting all skills for a user.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all skills for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const skills = await prisma.skill.findMany({
      where: { userId: params.userId },
      orderBy: { name: "asc" },
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

// CREATE a new skill for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    // Map the incoming 'proficiency' field to 'proficiencyLevel' for Prisma
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        proficiencyLevel: data.proficiency, // Map from frontend's proficiency to DB's proficiencyLevel
        category: data.category,
        user: { connect: { id: params.userId } },
      },
    });

    // Map back to frontend format
    return NextResponse.json({
      id: skill.id,
      name: skill.name,
      proficiency: skill.proficiencyLevel,
      category: skill.category,
    });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
