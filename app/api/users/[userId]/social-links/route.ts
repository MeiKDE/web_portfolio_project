//Summary
// This file (social-links/route.ts) is focused on getting all social links for a user.

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

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

// CREATE a new social link
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();

    const socialLink = await prisma.socialLink.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return successResponse(socialLink, "Social link created successfully", 201);
  } catch (error) {
    console.error("Error creating social link:", error);
    return errorResponse("Failed to create social link", 500);
  }
}
