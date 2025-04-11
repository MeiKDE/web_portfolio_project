// Create new skill
// Create new certification
import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  withOwnership,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import { z } from "zod";

// Define schema for validation
const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
  proficiencyLevel: z.number().int().min(1).max(5),
});

// CREATE a new skill
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return errorResponse("Unauthorized", 401);
  }

  const data = await req.json();

  // Verify the userId matches the authenticated user
  if (data.userId !== session.user.id) {
    return errorResponse("Unauthorized", 403);
  }

  // Validate the data
  const validationResult = skillSchema.safeParse(data);

  if (!validationResult.success) {
    return errorResponse(
      "Invalid skill data: " + JSON.stringify(validationResult.error.format()),
      400
    );
  }
  const { name, category, proficiencyLevel } = validationResult.data;

  console.log("name", name);
  console.log("category", category);
  console.log("proficiencyLevel", proficiencyLevel);

  const skill = await prisma.skill.create({
    data: {
      name,
      category,
      proficiencyLevel,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });
  return successResponse(skill);
}
