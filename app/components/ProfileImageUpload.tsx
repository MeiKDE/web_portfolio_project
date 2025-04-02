"use client";

import React, { useState, useRef, JSX } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Link, Upload, X } from "lucide-react";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

interface ProfileImageUploadProps {
  user: UserData | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  editable?: boolean;
  onImageChange?: (imageUrl: string) => void;
}

export const ProfileImageUpload = ({
  user,
  size = "md",
  className = "",
  editable = false,
  onImageChange,
}: ProfileImageUploadProps) => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size mappings
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-32 w-32",
    lg: "h-40 w-40",
  };

  const containerClass = `relative ${sizeClasses[size]} overflow-hidden rounded-full border-4 border-white shadow-md ${className}`;
  const fallbackClass = `flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500`;

  // Get first letter of name for fallback
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (onImageChange && imageUrl !== user?.image) {
      onImageChange(imageUrl);
    }
    setIsEditingImage(false);
  };

  const handleCancelEdit = () => {
    setImageUrl(user?.image || "");
    setIsEditingImage(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-shrink-0">
      <div className={containerClass}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={user?.name || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className={fallbackClass}>{firstLetter}</div>
        )}

        {editable && !isEditingImage && (
          <button
            onClick={() => setIsEditingImage(true)}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full"
          >
            <Camera className="h-8 w-8 text-white" />
          </button>
        )}
      </div>

      {editable && isEditingImage && (
        <div className="mt-4 p-4 border rounded-md shadow-sm bg-white">
          <div className="flex space-x-2 mb-3">
            <Button
              variant={imageInputType === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setImageInputType("url")}
              className="flex-1"
            >
              <Link className="mr-2 h-4 w-4" />
              URL
            </Button>
            <Button
              variant={imageInputType === "file" ? "default" : "outline"}
              size="sm"
              onClick={() => setImageInputType("file")}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>

          {imageInputType === "url" ? (
            <Input
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="mb-3"
            />
          ) : (
            <>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={triggerFileInput}
                className="w-full mb-3"
              >
                Choose Image File
              </Button>
              {imageUrl && imageUrl !== user?.image && (
                <p className="text-xs text-green-600 mb-3">
                  New image selected
                </p>
              )}
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSaveImage}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
