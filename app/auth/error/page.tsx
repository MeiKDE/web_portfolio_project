"use client";

import { useAuthError } from "@/app/hooks/auth/use-auth-error";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function AuthError() {
  const { errorMessage, isError } = useAuthError();

  if (!isError) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <div className="flex flex-col space-y-2">
          <Button asChild variant="default">
            <Link href="/api/auth/signin">Try Again</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
