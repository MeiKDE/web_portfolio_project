"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
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
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner fullPage text="Checking authentication..." />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
