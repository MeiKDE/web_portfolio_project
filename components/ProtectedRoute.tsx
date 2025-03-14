"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

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
    return (
      loadingComponent || (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[200px]">
          <div className="animate-pulse text-center">
            <div className="h-8 w-8 mx-auto rounded-full bg-gray-200 mb-2"></div>
            <div className="h-4 w-24 mx-auto bg-gray-200 rounded"></div>
          </div>
        </div>
      )
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
