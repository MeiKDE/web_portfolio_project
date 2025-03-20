import { successResponse, errorResponse, withAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { userProfileSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      title: user.title,
      location: user.location,
      phone: user.phone,
      bio: user.bio,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse("Error fetching user data", 500);
  }
});

export const PUT = withAuth(async (request: NextRequest, context, user) => {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = userProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
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
    return errorResponse("Error updating user data", 500);
  }
});
