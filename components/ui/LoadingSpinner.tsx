import React, { JSX } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  text = "Loading...",
  fullPage = false,
}: LoadingSpinnerProps) {
  // Size mappings
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-2",
    lg: "h-16 w-16 border-3",
  };

  const spinnerClass = `animate-spin rounded-full ${sizeClasses[size]} border-t-primary border-r-transparent border-b-primary border-l-transparent`;

  const containerClass = fullPage
    ? "flex flex-col items-center justify-center min-h-[70vh]"
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {text && <p className="mt-4 text-muted-foreground">{text}</p>}
    </div>
  );
}
