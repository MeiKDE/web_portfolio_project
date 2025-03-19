import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { updateUserProfile } from "@/lib/user-service";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(errorResponse("User ID not found in session"), {
        status: 400,
      });
    }

    // Parse the request body
    const body = await request.json();
    const { profileData } = body;

    if (!profileData) {
      return NextResponse.json(errorResponse("No profile data provided"), {
        status: 400,
      });
    }

    // Update user profile with parsed data
    await updateUserProfile(userId, profileData);

    return NextResponse.json(
      successResponse({
        message: "Profile saved successfully",
      })
    );
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json(
      errorResponse(
        error instanceof Error ? error.message : "Failed to save profile"
      ),
      { status: 500 }
    );
  }
}
