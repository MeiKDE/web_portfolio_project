"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "link" | "icon";
}

export default function LogoutButton({
  className = "",
  variant = "default",
}: LogoutButtonProps) {
  // ... rest of the component remains the same
}
