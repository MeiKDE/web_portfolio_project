"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  loadingComponent?: ReactNode;
}

export default function ProtectedRoute({
  children,
  loadingComponent,
}: ProtectedRouteProps) {
  const { status } = useSession();

  if (status === "loading") {
    return <LoadingSpinner fullPage text="Checking authentication..." />;
  }

  return <>{children}</>;
}
