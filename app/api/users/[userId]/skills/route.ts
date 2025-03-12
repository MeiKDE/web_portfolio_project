//Summary
// This file (skills/route.ts) is focused on getting all skills for a user.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET skills for a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the skills for the specified user
    const skills = await prisma.skill.findMany({
      where: { userId: userId },
      orderBy: { name: "asc" },
    });

    // Map proficiencyLevel to proficiency for frontend consistency
    const mappedSkills = skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      proficiency: skill.proficiencyLevel, // Map from DB's proficiencyLevel to frontend's proficiency
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
    const userId = params.userId;

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user from the session
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    // Only allow users to add skills to their own profile
    if (!currentUser || currentUser.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the skill data from the request
    const data = await request.json();

    // Create the new skill
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        proficiencyLevel: data.proficiency,
        userId: userId,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
