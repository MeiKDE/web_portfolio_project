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
import { handleApiError, createApiError } from "@/app/lib/api/error-handler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth/auth-options";

// GET a single certification
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certification = await prisma.certification.findUnique({
      where: { id: params.id },
    });

    if (!certification) {
      throw createApiError.notFound("Certification not found");
    }

    return successResponse(certification);
  } catch (error) {
    return handleApiError(error);
  }
}

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
        throw createApiError.badRequest(
          "Invalid certification data",
          validationResult.error.format()
        );
      }

      // Update the certification in the database
      const updatedCertification = await prisma.certification.update({
        where: { id: params.id },
        data: validationResult.data,
      });

      return successResponse(updatedCertification);
    } catch (error) {
      return handleApiError(error);
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
      return handleApiError(error);
    }
  },
  "certification"
);
