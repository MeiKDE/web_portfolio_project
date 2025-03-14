"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // ... rest of the component remains the same
}
