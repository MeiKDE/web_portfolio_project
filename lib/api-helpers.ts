import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createApiError } from "./error-handler";
import { z } from "zod";
import { NextResponse } from "next/server";

/**
 * Type for API responses to ensure consistency
 */
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Creates a standardized success response
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
  message: string,
  errors?: Record<string, string[]>
): ApiResponse {
  return {
    success: false,
    message,
    errors,
  };
}

// Type for route handler functions
type RouteHandler = (
  request: NextRequest,
  context: { params: any },
  user: any
) => Promise<Response | ApiResponse>;

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
        return NextResponse.json(
          errorResponse(
            apiError.message || "Authentication failed",
            apiError.errors
          ),
          { status: apiError.statusCode || 401 }
        );
      }

      return NextResponse.json(errorResponse("Authentication failed"), {
        status: 401,
      });
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
        return NextResponse.json(
          errorResponse(
            apiError.message ||
              `Failed to verify ownership of ${String(resourceType)}`,
            apiError.errors
          ),
          { status: apiError.statusCode || 403 }
        );
      }

      return NextResponse.json(
        errorResponse("Failed to verify ownership of resource"),
        { status: 403 }
      );
    }
  });
}
