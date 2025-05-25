// -----------------------------------------------------
// GET /api/certifications - Get all certifications for the current user
// POST /api/certifications - Create a new certification item
// -----------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { certificationSchema } from "@/app/hooks/validations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import { withAuth } from "@/app/lib/api/api-helpers";

// GET all certifications for the current user
export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    const certifications = await prisma.certification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        issueDate: "desc",
      },
    });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
});

// CREATE a new certification
export const POST = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate the request body using certificationSchema
  const validationResult = certificationSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.errors[0].message },
      { status: 400 }
    );
  }

  const { name, issuer, issueDate, expirationDate, credentialUrl } =
    validationResult.data;

  const certification = await prisma.certification.create({
    data: {
      name,
      issuer,
      issueDate,
      expirationDate,
      credentialUrl,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(certification);
};
