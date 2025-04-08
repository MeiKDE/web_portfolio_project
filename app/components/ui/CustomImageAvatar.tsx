"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils/utils";

export interface CustomImageProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  containerClassName?: string;
  fallback?: React.ReactNode;
  rounded?: boolean;
  bordered?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export const CustomImageAvatar = ({
  src,
  alt,
  size = "md",
  className = "",
  containerClassName = "",
  fallback,
  rounded = false,
  bordered = false,
  objectFit = "cover",
}: CustomImageProps) => {
  // Size mappings
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-32 w-32",
    lg: "h-40 w-40",
    xl: "h-60 w-60",
    full: "h-full w-full",
  };

  // Rounded and bordered styles
  const roundedClass = rounded ? "rounded-full" : "rounded-md";
  const borderedClass = bordered ? "border-4 border-white shadow-md" : "";

  // Container class for the image
  const containerClass = cn(
    "relative overflow-hidden",
    sizeClasses[size],
    roundedClass,
    borderedClass,
    containerClassName
  );

  // Fallback class for when image is not available
  const fallbackClass = cn(
    "flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500"
  );

  // Object fit class for the image
  const objectFitClass = `object-${objectFit}`;

  return (
    <div className={containerClass}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(objectFitClass, className)}
        />
      ) : (
        <div className={fallbackClass}>
          {fallback || alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};
