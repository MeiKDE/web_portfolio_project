"use client";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ProfileImageUpload } from "@/app/components/ProfileImageUpload";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { toast } from "sonner";
import { ProfileItem } from "@/app/components/Profile/List/ProfileItem";
import { ProfileForm } from "@/app/components/Profile/List/ProfileForm";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useState, useEffect } from "react";

interface ProfileHeaderProps {
  id: string;
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

export default function ProfileHeader({ id }: ProfileHeaderProps) {
  const { data: session } = useSession();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [isProfileValidMap, setIsProfileValidMap] = useState<
    Map<string, boolean>
  >(new Map());

  // Add debugging logs
  console.log("Profile ID:", id);
  console.log("Session:", session);

  const { data, isLoading, error, mutate } = useFetchData<UserData>(
    `/api/users/${id}`
  );

  // Add debugging for API response
  console.log("API Response data:", data);
  console.log("API Error:", error);

  // Add this check to determine if the current user can edit the profile
  const canEditProfile = session?.user?.id === id;
  console.log("canEditProfile", canEditProfile);

  useEffect(() => {
    if (data) {
      setProfileData(data);
      setFormData(data);
    }
  }, [data]);

  // Update profile
  const updateProfile = async (profileData: UserData) => {
    try {
      // Filter out null or undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(profileData).filter(
          ([_, value]) => value !== null && value !== undefined
        )
      );

      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      return result.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
      throw error;
    }
  };

  // Handle profile updates
  const onUpdateProfile = async () => {
    setIsSubmittingItem(true);
    console.log("updating profile - formData", formData);
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
  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading profile information</p>
            <button
              onClick={() => mutate()}
              className="mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profileData) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <p>No profile data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Profile</h3>
          {/* Only show edit buttons if user can edit the profile */}
          {canEditProfile && (
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
          )}
        </div>
        {/* Update ProfileImageUpload to respect editing permissions */}
        <div className="flex flex-col md:flex-row gap-6">
          <ProfileImageUpload
            user={formData || profileData}
            editable={isEditingMode && canEditProfile}
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
                  location: profileData.location || "",
                  phone: profileData.phone,
                  profile_email: profileData.profile_email || profileData.email,
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
