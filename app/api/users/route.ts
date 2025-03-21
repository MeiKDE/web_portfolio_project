import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import prisma from "@/app/lib/db/prisma";
import { successResponse, errorResponse } from "@/app/lib/api/api-helpers";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return errorResponse("Unauthorized");
    }

    // Fetch all users (you might want to add pagination or filtering)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        // Exclude sensitive information like password
      },
    });

    return successResponse(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    if (error instanceof Error) {
      // Sanitize error message to avoid leaking sensitive information
      const safeErrorMessage = error.message.replace(
        /\b(password|token|secret|key)\b/gi,
        "***"
      );
      return errorResponse(`Failed to fetch users: ${safeErrorMessage}`);
    }

    return errorResponse("Failed to fetch users");
  }
}
