// Define all authentication error types
export const AUTH_ERROR_TYPES = {
  // OAuth Errors
  OAUTH_CREATE_ACCOUNT: "OAuthCreateAccount",
  OAUTH_ACCOUNT_NOT_LINKED: "OAuthAccountNotLinked",
  OAUTH_CALLBACK_ERROR: "OAuthCallbackError",

  // Credential Errors
  INVALID_CREDENTIALS: "CredentialsSignin",
  INVALID_EMAIL: "InvalidEmail",
  INVALID_PASSWORD: "InvalidPassword",

  // Account Status Errors
  EMAIL_NOT_VERIFIED: "EmailNotVerified",
  ACCOUNT_DISABLED: "AccountDisabled",

  // Session Errors
  SESSION_EXPIRED: "SessionExpired",

  // Generic Errors
  DEFAULT: "Default",
  UNKNOWN: "Unknown",
} as const;

// Error messages for each error type
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_ERROR_TYPES.OAUTH_CREATE_ACCOUNT]:
    "There was a problem creating your account. This could be because an account with your email already exists with a different sign-in method.",
  [AUTH_ERROR_TYPES.OAUTH_ACCOUNT_NOT_LINKED]:
    "This email is already associated with an account. Please sign in using your original method or contact support to link your accounts.",
  [AUTH_ERROR_TYPES.OAUTH_CALLBACK_ERROR]:
    "There was a problem signing in with your social account. Please try again.",
  [AUTH_ERROR_TYPES.INVALID_CREDENTIALS]:
    "Invalid email or password. Please check your credentials and try again.",
  [AUTH_ERROR_TYPES.INVALID_EMAIL]:
    "The email address you entered is not valid.",
  [AUTH_ERROR_TYPES.INVALID_PASSWORD]: "The password you entered is incorrect.",
  [AUTH_ERROR_TYPES.EMAIL_NOT_VERIFIED]:
    "Please verify your email address before signing in.",
  [AUTH_ERROR_TYPES.ACCOUNT_DISABLED]:
    "Your account has been disabled. Please contact support for assistance.",
  [AUTH_ERROR_TYPES.SESSION_EXPIRED]:
    "Your session has expired. Please sign in again.",
  [AUTH_ERROR_TYPES.DEFAULT]:
    "An authentication error occurred. Please try again later.",
  [AUTH_ERROR_TYPES.UNKNOWN]:
    "An unexpected error occurred. Please try again later.",
};

// Helper function to get error message
export function getAuthErrorMessage(errorType: string): string {
  return (
    AUTH_ERROR_MESSAGES[errorType] ||
    AUTH_ERROR_MESSAGES[AUTH_ERROR_TYPES.DEFAULT]
  );
}

// Helper function to handle auth errors
export function handleAuthError(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific error types
    if ("code" in error) {
      const errorCode = (error as { code: string }).code;
      return getAuthErrorMessage(errorCode);
    }
    return error.message;
  }
  if (typeof error === "string") {
    return getAuthErrorMessage(error);
  }
  return AUTH_ERROR_MESSAGES[AUTH_ERROR_TYPES.UNKNOWN];
}
