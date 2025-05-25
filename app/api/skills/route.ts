// -----------------------------------------------------
// GET /api/skills - Get all skills for the current user
// POST /api/skills - Create a new skill item
// -----------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { withAuth } from "@/app/lib/api/api-helpers";
import { skillSchema } from "@/app/hooks/validations";

// GET all skills for the current user
export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    const skills = await prisma.skill.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
});

// CREATE a new skill
export const POST = withAuth(async (request: NextRequest, context, user) => {
  const body = await request.json();

  const validationResult = skillSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.errors[0].message },
      { status: 400 }
    );
  }

  const { name, category, proficiencyLevel } = validationResult.data;

  try {
    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        proficiencyLevel,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
});
