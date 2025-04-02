import { errorResponse, successResponse } from "./api-helpers";
import { ZodError } from "zod";

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
export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};

    error.errors.forEach((err) => {
      const field = err.path.join(".");
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(err.message);
    });

    return errorResponse("Validation failed", 400, formattedErrors);
  }

  // Handle other types of errors
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return errorResponse(message);
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
    error.message,
    error.statusCode,
    error.details ? { details: error.details } : undefined
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
