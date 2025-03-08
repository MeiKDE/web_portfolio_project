"use client";

import AuthContext from "@/context/AuthContext";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthContext>
      {/* Add any other providers here */}
      {children}
    </AuthContext>
  );
}
