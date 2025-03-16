"use client";

import React from "react";
import Image from "next/image";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

interface ProfileImageProps {
  user: UserData | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ProfileImage = ({
  user,
  size = "md",
  className = "",
}: ProfileImageProps) => {
  // Size mappings
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-32 w-32",
    lg: "h-40 w-40",
  };

  const containerClass = `relative ${sizeClasses[size]} overflow-hidden rounded-full border-4 border-white shadow-md ${className}`;
  const fallbackClass = `flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500`;

  // Get first letter of name for fallback
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex-shrink-0">
      <div className={containerClass}>
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className={fallbackClass}>{firstLetter}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
