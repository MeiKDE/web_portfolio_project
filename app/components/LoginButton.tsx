import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()} className="btn btn-primary">
        Sign Out
      </button>
    );
  }

  return (
    <button onClick={() => signIn()} className="btn btn-primary">
      Sign In
    </button>
  );
}
