//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import {
  withAuth,
  withOwnership,
  successResponse,
  errorResponse,
} from "@/lib/api-helpers";
import { z } from "zod";

// Define schema for validation
const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  description: z.string().min(1, "Description is required"),
  isCurrentPosition: z.boolean().optional().default(false),
});

// UPDATE an experience
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const body = await request.json();

      // Convert date strings to Date objects
      if (body.startDate) {
        body.startDate = new Date(body.startDate);
      }
      if (body.endDate) {
        body.endDate = new Date(body.endDate);
      }

      const validationResult = experienceSchema.safeParse(body);

      if (!validationResult.success) {
        return errorResponse(
          "Invalid experience data: " +
            JSON.stringify(validationResult.error.format())
        );
      }

      // Check if the experience exists and belongs to the user
      const existingExperience = await prisma.experience.findFirst({
        where: {
          id: params.id,
          userId: user.id,
        },
      });

      if (!existingExperience) {
        return errorResponse("Experience not found");
      }

      // Update the experience
      const updatedExperience = await prisma.experience.update({
        where: { id: params.id },
        data: {
          position: body.position,
          company: body.company,
          location: body.location,
          startDate: body.startDate,
          endDate: body.endDate,
          description: body.description,
          isCurrentPosition: body.isCurrentPosition,
          userId: user.id, // Ensure the user ID is included
        },
      });

      return successResponse(updatedExperience);
    } catch (error) {
      console.error("Error updating experience:", error);
      return errorResponse("Failed to update experience");
    }
  },
  "experience"
);

// DELETE an experience
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.experience.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "Experience deleted successfully" });
    } catch (error) {
      console.error("Error deleting experience:", error);
      return errorResponse("Failed to delete experience");
    }
  },
  "experience"
);
