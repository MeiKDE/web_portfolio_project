import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-helpers";
import { handleApiError } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  try {
    // The actual logout is handled by NextAuth.js on the client side
    // This endpoint is just for completeness and could be used for additional cleanup

    return successResponse({
      message: "Logout successful",
    });
  } catch (error) {
    return handleApiError(error, "Logout failed", "POST /auth/logout");
  }
}
