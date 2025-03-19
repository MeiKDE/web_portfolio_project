"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Mail, Phone, Calendar, Save, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFormValidation } from "@/lib/form-validation";
import { userProfileSchema } from "@/lib/validations";
import ProfileImage from "@/components/ProfileImage";
import PhoneInput from "@/components/PhoneInput";

interface UserProps {
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

export default function User({ userId }: UserProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [formState, setFormState] = useState({
    validationErrors: {} as Record<string, string>,
    touchedFields: {} as Record<string, boolean>,
    phoneError: null as string | null,
    isSubmitting: false,
    error: null as string | null,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fetchController = useRef<AbortController | null>(null);
  const hasFetched = useRef(false);

  // Use the form validation hook
  const {
    validateData,
    getFieldError,
    touchField,
    isFieldTouched,
    getInputClassName,
  } = useFormValidation();

  // Memoize the fetch function to avoid recreation on each render
  const fetchUser = useCallback(async () => {
    // Skip if no userId or already fetched
    if (!userId || hasFetched.current) return;

    // Cancel previous fetch if it exists
    if (fetchController.current) {
      fetchController.current.abort();
    }

    // Create new controller for this fetch
    fetchController.current = new AbortController();

    try {
      setFormState((prev) => ({ ...prev, error: null }));
      setLoading(true);

      const response = await fetch(`/api/users/${userId}`, {
        signal: fetchController.current.signal,
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const userData = await response.json();

      // Ensure we have the name from the User model
      const userWithDefaults = {
        ...userData.data,
        name: userData.data.name || "User", // Use name from User model or fallback
      };

      setUser(userWithDefaults);
      setEditedUser(JSON.parse(JSON.stringify(userWithDefaults)));
      hasFetched.current = true;
    } catch (error) {
      // Only log and set error if it's not an abort error
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Error fetching user:", error);
        setFormState((prev) => ({
          ...prev,
          error: "Failed to load user profile. Please try again.",
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();

    // Cleanup function to abort fetch if component unmounts
    return () => {
      if (fetchController.current) {
        fetchController.current.abort();
      }
    };
  }, [fetchUser]);

  const handleEditToggle = () => {
    if (isEditing) {
      saveChanges();
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    // Skip if user or editedUser is not available
    if (!editedUser) return;

    setEditedUser((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });

    // Validate the field if it's part of userProfileSchema
    try {
      const partialSchema = userProfileSchema.pick({ [field]: true });
      validateData("user", { [field]: value }, partialSchema);
    } catch (error) {
      console.error(`Error validating field ${field}:`, error);
    }
  };

  const handleAvailabilityToggle = (isAvailable: boolean) => {
    if (!editedUser) return;
    setEditedUser({
      ...editedUser,
      isAvailable,
    });

    // Mark field as touched
    setFormState((prev) => ({
      ...prev,
      touchedFields: {
        ...prev.touchedFields,
        isAvailable: true,
      },
    }));
  };

  const saveChanges = async () => {
    if (!editedUser || !user) return;

    try {
      // Validate all fields
      const validationResult = validateData(
        "user",
        editedUser,
        userProfileSchema
      );
      if (!validationResult.success) {
        return; // Validation failed, errors are in formState
      }

      setFormState((prev) => ({ ...prev, isSubmitting: true, error: null }));

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser.data);
      setEditedUser(JSON.parse(JSON.stringify(updatedUser.data)));
      setIsEditing(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setFormState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to save profile",
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(JSON.parse(JSON.stringify(user)));
    setFormState({
      validationErrors: {},
      touchedFields: {},
      phoneError: null,
      isSubmitting: false,
      error: null,
    });
  };

  const updateFormState = (updates: Partial<typeof formState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  // Handle phone validation
  const validatePhone = (phone: string) => {
    if (!phone) return true;
    // Simple phone validation - can be enhanced as needed
    const phoneRegex = /^\+?[0-9\s\-\(\)]{7,}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (value: string) => {
    const isValid = validatePhone(value);
    setFormState((prev) => ({
      ...prev,
      phoneError: isValid ? null : "Please enter a valid phone number",
    }));
    handleInputChange("phone", value);
  };

  if (loading && !user) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
          <LoadingSpinner text="Loading profile..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {formState.error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {formState.error}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Profile updated successfully!
          </div>
        )}

        {!user ? (
          <div>User not found</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <ProfileImage
              user={editedUser || user}
              editable={isEditing}
              onImageChange={(imageUrl) => handleInputChange("image", imageUrl)}
            />

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  {isEditing ? (
                    <div className="mb-2 w-full md:max-w-sm">
                      <Input
                        value={editedUser?.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={getInputClassName("user", "name", "text-xl")}
                        placeholder="Your Name"
                      />
                      {isFieldTouched("user", "name") &&
                        getFieldError("user", "name") && (
                          <p className="text-red-500 text-xs mt-1">
                            {getFieldError("user", "name")}
                          </p>
                        )}
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                  )}

                  {isEditing ? (
                    <div className="mb-2 w-full md:max-w-sm">
                      <Input
                        value={editedUser?.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className={getInputClassName("user", "title")}
                        placeholder="Your Professional Title"
                      />
                      {isFieldTouched("user", "title") &&
                        getFieldError("user", "title") && (
                          <p className="text-red-500 text-xs mt-1">
                            {getFieldError("user", "title")}
                          </p>
                        )}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {user.title || "No title set"}
                    </p>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={formState.isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={saveChanges}
                      disabled={formState.isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {formState.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Contact & Location */}
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {isEditing ? (
                    <div className="w-full">
                      <Input
                        value={editedUser?.location || ""}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className={getInputClassName(
                          "user",
                          "location",
                          "text-sm"
                        )}
                        placeholder="Your Location (e.g., New York, NY)"
                      />
                      {isFieldTouched("user", "location") &&
                        getFieldError("user", "location") && (
                          <p className="text-red-500 text-xs mt-1">
                            {getFieldError("user", "location")}
                          </p>
                        )}
                    </div>
                  ) : (
                    <span>{user.location || "No location set"}</span>
                  )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  {isEditing ? (
                    <div className="flex flex-col w-full">
                      <div className="text-xs text-muted-foreground mb-1">
                        Account Email (cannot be changed): {user?.email}
                      </div>
                      <Input
                        value={editedUser?.profile_email || ""}
                        onChange={(e) =>
                          handleInputChange("profile_email", e.target.value)
                        }
                        className={getInputClassName(
                          "user",
                          "profile_email",
                          "text-sm"
                        )}
                        placeholder="Contact Email (Optional)"
                      />
                      {isFieldTouched("user", "profile_email") &&
                        getFieldError("user", "profile_email") && (
                          <p className="text-red-500 text-xs mt-1">
                            {getFieldError("user", "profile_email")}
                          </p>
                        )}
                    </div>
                  ) : (
                    <span>
                      {user?.profile_email || user?.email}
                      {user?.profile_email &&
                        user?.profile_email !== user?.email && (
                          <span className="text-xs ml-2 text-muted-foreground">
                            (Contact email)
                          </span>
                        )}
                    </span>
                  )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  {isEditing ? (
                    <div className="w-full">
                      <PhoneInput
                        value={editedUser?.phone || ""}
                        onChange={handlePhoneChange}
                        className={
                          formState.phoneError
                            ? "border-red-500 text-sm"
                            : "text-sm"
                        }
                        placeholder="Your Phone Number (Optional)"
                      />
                      {formState.phoneError && (
                        <p className="text-red-500 text-xs mt-1">
                          {formState.phoneError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span>{user.phone || "No phone number set"}</span>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">About Me</h3>
                {isEditing ? (
                  <div>
                    <Textarea
                      value={editedUser?.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className={getInputClassName("user", "bio")}
                      placeholder="Tell us about yourself, your expertise, and your interests..."
                      rows={4}
                    />
                    {isFieldTouched("user", "bio") &&
                      getFieldError("user", "bio") && (
                        <p className="text-red-500 text-xs mt-1">
                          {getFieldError("user", "bio")}
                        </p>
                      )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {user.bio || "No bio added yet"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
