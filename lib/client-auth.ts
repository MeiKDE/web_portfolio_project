"use client";

import { useSession, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return {
    user: session?.user,
    isAuthenticated,
    isLoading,
    signOut,
  };
}
