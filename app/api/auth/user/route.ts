import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { userProfileSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse(401, "Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
      },
    });

    if (!user) {
      return errorResponse(404, "User not found");
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse(500, "Error fetching user data");
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return errorResponse(401, "Not authenticated");
    }

    const body = await request.json();

    // Validate the request body
    const validatedData = userProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: validatedData.name,
        title: validatedData.title,
        location: validatedData.location,
        phone: validatedData.phone,
        bio: validatedData.bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
      },
    });

    return successResponse(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse(500, "Error updating user data");
  }
}
