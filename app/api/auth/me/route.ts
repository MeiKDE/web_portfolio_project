// this file is focused on getting the current user's data

import {
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";
import { NextRequest } from "next/server";

export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    // Additional user data is already available in the 'user' parameter
    // provided by withAuth HOC
    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      title: user.title,
      location: user.location,
      phone: user.phone,
      bio: user.bio,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return errorResponse("Failed to fetch current user", 500);
  }
});
