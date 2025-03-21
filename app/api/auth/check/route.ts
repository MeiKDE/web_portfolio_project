import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import { successResponse, errorResponse } from "@/app/lib/api/api-helpers";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return errorResponse("Not authenticated");
  }

  return successResponse({ authenticated: true });
}
