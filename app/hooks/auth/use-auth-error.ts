"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getAuthErrorMessage } from "@/app/lib/auth/auth-errors";

export function useAuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setIsError(true);
    } else {
      setIsError(false);
      setErrorMessage("");
    }
  }, [searchParams]);

  const clearError = () => {
    setIsError(false);
    setErrorMessage("");
  };

  return {
    errorMessage,
    isError,
    clearError,
  };
}
