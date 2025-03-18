import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { updateUserProfile } from "@/lib/user-service";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse(401, "Unauthorized");
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return errorResponse(400, "User ID not found in session");
    }

    // Parse the request body
    const body = await request.json();
    const { profileData } = body;

    if (!profileData) {
      return errorResponse(400, "No profile data provided");
    }

    // Update user profile with parsed data
    await updateUserProfile(userId, profileData);

    return successResponse({
      message: "Profile saved successfully",
    });
  } catch (error) {
    console.error("Profile save error:", error);
    return errorResponse(
      500,
      error instanceof Error ? error.message : "Failed to save profile"
    );
  }
}
