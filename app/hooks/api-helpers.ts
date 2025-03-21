import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import prisma from "@/lib/prisma";
import { createApiError } from "./error-handler";
import { z } from "zod";

/**
 * Type for API responses to ensure consistency
 */
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]> | any;
};

/**
 * Creates a standardized success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): Response {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string[]> | any
): Response {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
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
  errors?: Record<string, string[]>;
}

/**
 * Validates request body against a Zod schema
 * @param request The NextRequest object
 * @param schema Zod schema to validate against
 * @returns Validated data
 * @throws ApiError if validation fails
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      throw createApiError.badRequest(
        "Validation failed",
        result.error.format()
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createApiError.badRequest("Validation failed", error.format());
    }

    if (error instanceof Error && error.name === "ApiError") {
      throw error;
    }

    throw createApiError.badRequest("Invalid request data");
  }
}

// withAuth higher-order function
export function withAuth(handler: RouteHandler) {
  return async (request: NextRequest, context: any) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        return errorResponse("Not authenticated", 401);
      }

      // Get the user from the database
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
      });

      if (!user) {
        return errorResponse("User not found", 401);
      }

      return await handler(request, context, user);
    } catch (error) {
      console.error("Authentication error:", error);

      if (error instanceof Error) {
        // Cast to ApiError to access statusCode property
        const apiError = error as ApiError;
        return errorResponse(
          apiError.message || "Authentication failed",
          apiError.statusCode || 401,
          apiError.errors
        );
      }

      return errorResponse("Authentication failed", 401);
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
        return errorResponse(`${resourceTypeStr} not found`, 404);
      }

      // Check if the resource belongs to the user
      if (resource.userId !== user.id) {
        return errorResponse(
          `Not authorized to access this ${resourceTypeStr}`,
          403
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
        return errorResponse(
          apiError.message ||
            `Failed to verify ownership of ${String(resourceType)}`,
          apiError.statusCode || 403,
          apiError.errors
        );
      }

      return errorResponse("Failed to verify ownership of resource", 403);
    }
  });
}
