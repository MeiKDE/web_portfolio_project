//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withOwnership, successResponse } from "@/lib/api-helpers";
import { handleApiError, createApiError } from "@/lib/error-handler";
import { z } from "zod";

// Define schema for validation
const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  username: z.string().optional(),
});

// UPDATE a social link
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      // Validate the data
      const validationResult = socialLinkSchema.safeParse(data);

      if (!validationResult.success) {
        throw createApiError.badRequest(
          "Invalid social link data",
          validationResult.error.format()
        );
      }

      const socialLink = await prisma.socialLink.update({
        where: { id: params.id },
        data: validationResult.data,
      });

      return successResponse(socialLink);
    } catch (error) {
      return handleApiError(
        error,
        "Failed to update social link",
        "PUT /social-links/[id]"
      );
    }
  },
  "socialLink"
);

// DELETE a social link
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.socialLink.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "Social link deleted successfully" });
    } catch (error) {
      return handleApiError(
        error,
        "Failed to delete social link",
        "DELETE /social-links/[id]"
      );
    }
  },
  "socialLink"
);
