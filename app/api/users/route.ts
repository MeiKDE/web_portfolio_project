import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return errorResponse("Unauthorized", 401);
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
    return errorResponse("Failed to fetch users");
  }
}
