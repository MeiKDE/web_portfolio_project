"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ProfileImageUpload } from "@/app/components/ProfileImageUpload";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { toast } from "sonner";
import { ProfileItem } from "@/app/components/Profile/List/ProfileItem";
import { ProfileForm } from "@/app/components/Profile/List/ProfileForm";

interface ProfileHeaderProps {
  userId: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  profile_email?: string;
  image?: string;
  title?: string;
  location?: string;
  phone?: string;
  bio?: string;
  isAvailable?: boolean;
}

export default function ProfileHeader({ userId }: ProfileHeaderProps) {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [isProfileValidMap, setIsProfileValidMap] = useState<
    Map<string, boolean>
  >(new Map());

  // Fetch profile data using the same pattern as Skills
  const { data, isLoading, error, mutate } = useFetchData<UserData>(
    `/api/users/${userId}`
  );

  useEffect(() => {
    if (data) {
      setProfileData(data);
      setFormData(data);
    }
  }, [data]);

  // Update profile
  const updateProfile = async (profileData: UserData) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  // Handle profile updates
  const onUpdateProfile = async () => {
    setIsSubmittingItem(true);
    try {
      if (formData) {
        await updateProfile(formData);
        setIsEditingMode(false);
        mutate(); // Refresh the data
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmittingItem(false);
    }
  };

  // Handle form changes
  const onProfileChange = (field: string, value: any, isFormValid: boolean) => {
    setFormData((prev) => {
      if (!prev) return prev;
      setIsProfileValidMap((prevMap) => {
        prevMap.set(field, isFormValid);
        return prevMap;
      });
      setChangedFields((prev) => {
        prev.add(field);
        return prev;
      });
      return { ...prev, [field]: value };
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading profile information</div>;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Profile</h3>
          <div className="flex gap-2">
            {!isEditingMode && (
              <EditButton
                onClick={() => {
                  setIsEditingMode(true);
                }}
              />
            )}
            {isEditingMode && (
              <DoneButton
                onClick={onUpdateProfile}
                isSubmitting={isSubmittingItem}
                disabled={
                  !isProfileValidMap.values().every((isValid) => isValid)
                }
              >
                {isSubmittingItem ? "Saving..." : "Done"}
                {isSubmittingItem && (
                  <span className="ml-2 inline-block">
                    <LoadingSpinner size="sm" text="" />
                  </span>
                )}
              </DoneButton>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <ProfileImageUpload
            user={formData || profileData}
            editable={isEditingMode}
            onImageChange={(imageUrl) =>
              onProfileChange("image", imageUrl, true)
            }
          />

          <div className="flex-1">
            {!isEditingMode && profileData ? (
              <ProfileItem
                profile={{
                  name: profileData.name,
                  title: profileData.title || "",
                  description: profileData.bio || "",
                }}
              />
            ) : (
              formData && (
                <ProfileForm
                  profile={formData as any}
                  onFormChange={(id, field, value, isFormValid) =>
                    onProfileChange(field, value, isFormValid)
                  }
                />
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
