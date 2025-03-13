import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse } from "@/lib/api-helpers";
import { handleApiError, createApiError } from "@/lib/error-handler";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw createApiError.unauthorized("Not authenticated");
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
      throw createApiError.notFound("User not found");
    }

    return successResponse(user);
  } catch (error) {
    return handleApiError(error, "Error in /me route", "GET /auth/me");
  }
}
