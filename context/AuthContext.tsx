// it is used to provide the auth context to the application
// it is used to wrap the children with the session provider
// it is used to provide the session to the application
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthContextProps {
  children: ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
