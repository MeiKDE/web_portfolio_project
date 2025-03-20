import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse, withAuth } from "@/lib/api-helpers";
import { updateUserProfile } from "@/lib/user-service";
import { NextResponse } from "next/server";

export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    // Parse the request body
    const body = await request.json();
    const { profileData } = body;

    if (!profileData) {
      return errorResponse("No profile data provided", 400);
    }

    // Update user profile with parsed data
    await updateUserProfile(user.id, profileData);

    return successResponse({
      message: "Profile saved successfully",
    });
  } catch (error) {
    console.error("Profile save error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to save profile",
      500
    );
  }
});
