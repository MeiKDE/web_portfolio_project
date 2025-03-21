//Summary
// This file (social-links/route.ts) is focused on getting all social links for a user.

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { successResponse, errorResponse } from "@/app/lib/api/api-helpers";

// GET all social links for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { userId: params.userId },
      orderBy: { platform: "asc" },
    });

    return successResponse(socialLinks);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return errorResponse("Failed to fetch social links", 500);
  }
}
