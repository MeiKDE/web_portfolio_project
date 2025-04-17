"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Link, Upload, X } from "lucide-react";
import { CustomImageAvatar } from "@/app/components/ui/CustomImageAvatar";
import * as React from "react";
import { useRef, useState } from "react";

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

  // Get first letter of name for fallback
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  // Handle image url change
  // Sets the image url to the value of the input
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  // Handle file change
  // Sets the image url to the value of the file
  // The file comes from the file input
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

  // Handle save image
  // Saves the image to the user
  const handleSaveImage = () => {
    // If the image has changed, call the onImageChange function
    if (onImageChange && imageUrl !== user?.image) {
      onImageChange(imageUrl);
    }
    // Close the edit mode
    setIsEditingImage(false);
  };

  // Handle cancel edit
  // Cancels the edit mode
  const handleCancelEdit = () => {
    setImageUrl(user?.image || "");
    setIsEditingImage(false);
  };

  // Trigger file input
  // Opens the file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Render the component
  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <CustomImageAvatar
          src={imageUrl}
          alt={user?.name || "User"}
          size={size}
          className={className}
          rounded
          bordered
          fallback={firstLetter}
        />

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
            {/* url button, image input type is "url" */}
            <Button
              variant={imageInputType === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setImageInputType("url")}
              className="flex-1"
            >
              <Link className="mr-2 h-4 w-4" />
              URL
            </Button>
            {/* upload button, image input type is "file" */}
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
          {/* If the image input type is url, show the url input */}
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
              {/* If the image input type is file, show the file input */}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {/* If the image input type is file, show the button to choose the image file */}
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
