"use client";

import { useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // ... rest of the component remains the same
}
