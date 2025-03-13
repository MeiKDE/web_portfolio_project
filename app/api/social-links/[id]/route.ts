//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

// UPDATE a social link
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const socialLink = await prisma.socialLink.update({
      where: { id: params.id },
      data,
    });

    return successResponse(socialLink);
  } catch (error) {
    console.error("Error updating social link:", error);
    return errorResponse("Failed to update social link");
  }
}

// DELETE a social link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.socialLink.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Social link deleted successfully" });
  } catch (error) {
    console.error("Error deleting social link:", error);
    return errorResponse("Failed to delete social link");
  }
}
