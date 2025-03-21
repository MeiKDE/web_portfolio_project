//Summary
// This file (certifications/route.ts) is focused on getting all certifications for a user.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prisma";
import {
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";

// GET all certifications for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const certifications = await prisma.certification.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        issueDate: "desc",
      },
    });

    return successResponse(certifications);
  } catch (error) {
    return errorResponse("Failed to fetch certifications", 500);
  }
}
