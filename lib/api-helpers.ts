import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createApiError } from "./error-handler";

/**
 * Creates a standardized success response
 */
export function successResponse(data: any) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Creates a standardized error response
 */
export function errorResponse(statusCode: number, message: string) {
  return new Response(
    JSON.stringify({
      error: true,
      message,
    }),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// Type for route handler functions
type RouteHandler = (
  request: NextRequest,
  context: { params: any },
  user: any
) => Promise<Response>;

// Create a custom error type that includes statusCode
interface ApiError extends Error {
  statusCode?: number;
}

// withAuth higher-order function
export function withAuth(handler: RouteHandler) {
  return async (request: NextRequest, context: any) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        throw createApiError.unauthorized("Not authenticated");
      }

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
      });

      if (!user) {
        throw createApiError.unauthorized("User not found");
      }

      return await handler(request, context, user);
    } catch (error) {
      console.error("Authentication error:", error);

      if (error instanceof Error) {
        // Cast to ApiError to access statusCode property
        const apiError = error as ApiError;
        return errorResponse(apiError.statusCode || 500, apiError.message);
      }

      return errorResponse(500, "Authentication failed");
    }
  };
}

// Define a type for valid Prisma model names that have findUnique
type PrismaModelWithFindUnique = Exclude<
  keyof typeof prisma,
  "$on" | "$connect" | "$disconnect" | "$use" | "$transaction" | "$extends"
>;

// withOwnership higher-order function for resource ownership checks
export function withOwnership(
  handler: RouteHandler,
  resourceType: PrismaModelWithFindUnique,
  idParam: string = "id"
) {
  return withAuth(async (request: NextRequest, context, user) => {
    try {
      const resourceId = context.params[idParam];
      const resourceTypeStr = String(resourceType);

      // Cast to any to bypass TypeScript's limitation with dynamic model access
      const model = prisma[resourceType] as any;
      const resource = await model.findUnique({
        where: { id: resourceId },
      });

      if (!resource) {
        throw createApiError.notFound(`${resourceTypeStr} not found`);
      }

      // Check if the resource belongs to the user
      if (resource.userId !== user.id) {
        throw createApiError.forbidden(
          `Not authorized to access this ${resourceTypeStr}`
        );
      }

      return await handler(request, context, user);
    } catch (error) {
      console.error(
        `Ownership check error for ${String(resourceType)}:`,
        error
      );

      if (error instanceof Error) {
        // Cast to ApiError to access statusCode property
        const apiError = error as ApiError;
        return errorResponse(apiError.statusCode || 500, apiError.message);
      }

      return errorResponse(
        500,
        `Failed to verify ownership of ${String(resourceType)}`
      );
    }
  });
}
