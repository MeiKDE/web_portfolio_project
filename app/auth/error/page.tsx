"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  OAuthCreateAccount:
    "There was a problem creating your account. This could be because an account with your email already exists with a different sign-in method.",
  OAuthAccountNotLinked:
    "This email is already associated with an account. Please sign in using your original method or contact support to link your accounts.",
  // Add other error types as needed
  Default: "An authentication error occurred. Please try again later.",
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const error = searchParams.get("error");
    setErrorMessage(
      error && errorMessages[error]
        ? errorMessages[error]
        : errorMessages.Default
    );
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Authentication Error
        </h1>
        <p className="mb-6">{errorMessage}</p>
        <div className="flex flex-col space-y-4">
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 rounded-md text-center hover:bg-gray-50"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
