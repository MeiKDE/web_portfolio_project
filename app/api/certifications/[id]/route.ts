//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { certificationSchema } from "@/app/hooks/validations";
import {
  withOwnership,
  successResponse,
  errorResponse,
} from "@/app/lib/api/api-helpers";

// GET a single certification
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const data = await prisma.certification.findUnique({
      where: { id: params.id },
    });

    if (!data) {
      return errorResponse("Certification not found");
    }

    // Validate the database data against the schema
    const validationResult = certificationSchema.safeParse(data);

    if (!validationResult.success) {
      return errorResponse("Invalid certification data in database");
    }

    return successResponse(validationResult.data);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Failed to fetch certification",
      500
    );
  }
};

// UPDATE a certification
export const PUT = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      const data = await request.json();

      // Validate the incoming data
      const validationResult = certificationSchema.safeParse(data);

      if (!validationResult.success) {
        return errorResponse(
          "Invalid certification data",
          400,
          validationResult.error.format()
        );
      }

      const updatedCertification = await prisma.certification.update({
        where: { id: params.id },
        data: validationResult.data,
      });

      return successResponse(updatedCertification);
    } catch (error) {
      return errorResponse(
        error instanceof Error
          ? error.message
          : "Failed to update certification",
        500
      );
    }
  },
  "certification"
);

// DELETE a certification
export const DELETE = withOwnership(
  async (
    request: NextRequest,
    { params }: { params: { id: string } },
    user
  ) => {
    try {
      await prisma.certification.delete({
        where: { id: params.id },
      });

      return successResponse({ message: "Certification deleted successfully" });
    } catch (error) {
      return errorResponse(
        error instanceof Error
          ? error.message
          : "Failed to delete certification",
        500
      );
    }
  },
  "certification"
);
