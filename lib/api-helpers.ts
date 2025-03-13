import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 500, details?: any) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

// Type for route handler functions
type RouteHandler = (
  request: NextRequest,
  context: { params: any },
  user: any
) => Promise<NextResponse>;

// withAuth higher-order function
export const withAuth = (handler: RouteHandler) => {
  return async (request: NextRequest, context: { params: any }) => {
    try {
      // Get the session
      const session = await getServerSession(authOptions);
      console.log("Session in withAuth:", session);

      // Check if user is authenticated
      if (!session || !session.user) {
        return errorResponse("Unauthorized", 401);
      }

      // Pass the authenticated user to the handler
      return await handler(request, context, session.user);
    } catch (error) {
      console.error("Authentication error:", error);
      return errorResponse("Authentication failed");
    }
  };
};

// withOwnership higher-order function for resource ownership checks
export function withOwnership(
  handler: RouteHandler,
  resourceType: string,
  idParam: string = "id"
) {
  return withAuth(async (request: NextRequest, context, user) => {
    try {
      const resourceId = context.params[idParam];

      // Dynamically determine the Prisma model based on resourceType
      const resource = await prisma[resourceType].findUnique({
        where: { id: resourceId },
      });

      if (!resource) {
        return errorResponse(`${resourceType} not found`, 404);
      }

      // Check if the resource belongs to the user
      if (resource.userId !== user.id) {
        return errorResponse(
          `Not authorized to access this ${resourceType}`,
          403
        );
      }

      return await handler(request, context, user);
    } catch (error) {
      console.error(`Ownership check error for ${resourceType}:`, error);
      return errorResponse(`Failed to verify ownership of ${resourceType}`);
    }
  });
}
