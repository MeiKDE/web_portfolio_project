// Create new skill
// Create new certification

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { certificationSchema } from "@/app/hooks/validations";
import {
  withOwnership,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";

// CREATE a new certification
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return errorResponse("Unauthorized", 401);
  }

  const body = await request.json();
  const { name, category, proficiencyLevel } = body;

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
