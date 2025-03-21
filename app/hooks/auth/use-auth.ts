"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const login = useCallback(
    async (email: string, password: string, redirectUrl: string = "/") => {
      setLoading(true);
      setError(null);

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          setError(result.error);
          return false;
        }

        if (result?.ok) {
          router.push(redirectUrl);
          return true;
        }
      } catch (err) {
        setError("An unexpected error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(
    async (redirectUrl: string = "/login") => {
      setLoading(true);

      try {
        await signOut({ redirect: false });
        router.push(redirectUrl);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Include register functionality from the more complete implementation
  const register = useCallback(
    async (
      userData: { name: string; email: string; password: string },
      redirectUrl: string = "/login"
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Registration failed");
          return false;
        }

        router.push(redirectUrl);
        return true;
      } catch (err) {
        setError("An unexpected error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return {
    session,
    status,
    user: session?.user || null,
    isAuthenticated,
    isLoading,
    loading,
    error,
    login,
    logout,
    register,
    updateSession: update,
  };
}
