import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { handleApiError, createApiError } from "@/lib/error-handler";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    // Get additional user data from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
      },
    });

    if (!user) {
      return NextResponse.json(errorResponse("User not found"), {
        status: 404,
      });
    }

    return NextResponse.json(successResponse(user));
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(errorResponse("Failed to fetch current user"), {
      status: 500,
    });
  }
}
