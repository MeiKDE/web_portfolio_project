import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return errorResponse("Not authenticated", 401, { authenticated: false });
  }

  return successResponse({ authenticated: true });
}
