import { z } from "zod";
import { errorResponse, successResponse } from "./api-helpers";

// HTTP Status Code constants for consistent usage
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Sanitizes error messages to prevent leaking sensitive information
 */
export function sanitizeErrorMessage(message: string): string {
  return message.replace(
    /\b(password|token|secret|key|auth|hash|salt)\b/gi,
    "***"
  );
}

/**
 * A centralized error handler for API routes
 * @param error The caught error
 * @param defaultMessage Default message to return if error type is unknown
 * @param context Optional context information about where the error occurred
 */
export function handleApiError(
  error: unknown,
  defaultMessage = "An unexpected error occurred",
  context?: string
) {
  // Log the error with context for debugging
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error);

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return errorResponse(
      400,
      "Validation error" + HTTP_STATUS.BAD_REQUEST + error.format()
    );
  }

  // Handle our custom API errors
  if (error instanceof ApiError) {
    return handleApiErrorInstance(error);
  }

  // Handle standard JS errors
  if (error instanceof Error) {
    const safeMessage = sanitizeErrorMessage(error.message);
    return errorResponse(
      500,
      `${defaultMessage}: ${safeMessage}` + HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference
    const prismaError = error as { code: string; meta?: any; message?: string };

    // Handle common Prisma errors
    switch (prismaError.code) {
      case "P2002": // Unique constraint failed
        return errorResponse(
          409,
          "A record with this information already exists" + HTTP_STATUS.CONFLICT
        );
      case "P2025": // Record not found
        return errorResponse(404, "Record not found" + HTTP_STATUS.NOT_FOUND);
      default:
        // For other Prisma errors, return a generic message but log details
        const safeMessage = prismaError.message
          ? sanitizeErrorMessage(prismaError.message)
          : "Database error";
        return errorResponse(
          500,
          safeMessage + HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
  }

  // For unknown error types
  return errorResponse(500, defaultMessage + HTTP_STATUS.INTERNAL_SERVER_ERROR);
}

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(
    message: string,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details?: any
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Handles an ApiError by converting it to an appropriate response
 */
export function handleApiErrorInstance(error: ApiError) {
  return errorResponse(
    error.statusCode,
    error.message +
      (error.details ? ` (Details: ${JSON.stringify(error.details)})` : "")
  );
}

/**
 * Creates common API errors with appropriate status codes
 */
export const createApiError = {
  badRequest: (message = "Bad request", details?: any) =>
    new ApiError(message, HTTP_STATUS.BAD_REQUEST, details),

  unauthorized: (message = "Unauthorized") =>
    new ApiError(message, HTTP_STATUS.UNAUTHORIZED),

  forbidden: (message = "Forbidden") =>
    new ApiError(message, HTTP_STATUS.FORBIDDEN),

  notFound: (message = "Not found") =>
    new ApiError(message, HTTP_STATUS.NOT_FOUND),

  conflict: (message = "Conflict") =>
    new ApiError(message, HTTP_STATUS.CONFLICT),

  serverError: (message = "Internal server error") =>
    new ApiError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR),
};
