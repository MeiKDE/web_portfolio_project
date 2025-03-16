"use client";

import React, { useEffect, useState } from "react";
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

interface UserProps {
  userId: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
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

  // Use the form validation hook
  const {
    validateData,
    getFieldError,
    touchField,
    isFieldTouched,
    getInputClassName,
  } = useFormValidation();

  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        setFormState((prev) => ({ ...prev, error: null }));
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const userData = await response.json();

        // Ensure we have the name from the User model
        const userWithDefaults = {
          ...userData.data,
          name: userData.data.name || "User", // Use name from User model or fallback
        };

        setUser(userWithDefaults);
        setEditedUser(JSON.parse(JSON.stringify(userWithDefaults)));
      } catch (error) {
        console.error("Error fetching user:", error);
        setFormState((prev) => ({
          ...prev,
          error: "Failed to load user profile. Please try again.",
        }));
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  const handleEditToggle = () => {
    if (isEditing) {
      saveChanges();
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
    // For image field, convert null to empty string
    if (field === "image" && value === null) {
      value = "";
    }

    // Update your state
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));

    // Mark field as touched for immediate validation feedback
    touchField("user", field as string);

    // Validate if we have an edited user
    if (editedUser) {
      try {
        // Always validate to provide immediate feedback
        const result = validateData(
          {
            ...editedUser,
            [field]: value,
          },
          "user"
        );
        console.log(`Validation result for ${field}:`, result);

        // Check if there's an error for this field
        const error = getFieldError("user", field as string);
        console.log(`Error for ${field}:`, error);
      } catch (error) {
        console.error(`Validation error for ${field}:`, error);
      }
    }

    // For phone field, do direct validation
    if (field === "phone" && value) {
      const phoneRegex =
        /^(\+\d{1,3}( )?)?((\(\d{1,3}\))|\d{1,3})[- .]?\d{3,4}[- .]?\d{4}$/;
      if (!phoneRegex.test(value)) {
        setFormState((prev) => ({
          ...prev,
          phoneError:
            "Invalid phone number format. Please use a standard format like +1 (123) 456-7890",
        }));
      } else {
        setFormState((prev) => ({ ...prev, phoneError: null }));
      }
    } else if (field === "phone" && !value) {
      setFormState((prev) => ({ ...prev, phoneError: null })); // Clear error for empty phone
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
      ...prev.touchedFields,
      isAvailable: true,
    }));
  };

  const saveChanges = async () => {
    if (!editedUser) return;

    // Create a copy of editedUser with null values converted to empty strings
    const userToSubmit = {
      ...editedUser,
      // Ensure image is never null
      image: editedUser.image === null ? "" : editedUser.image || "",
      // Ensure phone is never null
      phone: editedUser.phone === null ? "" : editedUser.phone || "",
    };

    console.log("Attempting to save user data:", userToSubmit);

    // Mark all fields as touched when attempting to save
    const allFields = [
      "name",
      "title",
      "location",
      "bio",
      "phone",
      "isAvailable",
    ];
    const newTouchedFields = allFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setFormState((prev) => ({
      ...prev.touchedFields,
      ...newTouchedFields,
    }));

    // Validate all fields before submitting
    try {
      // Validate the edited user data using Zod
      const validatedData = userProfileSchema.parse(userToSubmit);

      // Continue with submission if validation passes
      setFormState((prev) => ({ ...prev, isSubmitting: true, error: null }));

      // Make sure we're calling the correct API endpoint
      const apiUrl = `/api/users/${userId}`;
      console.log(`Sending PUT request to ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }

      // Update the user state with the response data
      if (responseData.data) {
        setUser(responseData.data);
        setEditedUser(responseData.data);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000); // Hide after 3 seconds
        // Reset touched fields after successful save
        setFormState((prev) => ({
          ...prev.touchedFields,
          ...newTouchedFields,
        }));
        console.log("Profile updated successfully");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.issues);
        const errors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0];
            errors[fieldName] = err.message;
          }
        });
        setFormState((prev) => ({ ...prev, validationErrors: errors }));
        return;
      }
      console.error("Error saving changes:", error);
      setFormState((prev) => ({
        ...prev,
        error:
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to save changes. Please try again.",
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleCancelEdit = () => {
    // Check if user has made changes before showing confirmation
    if (JSON.stringify(user) !== JSON.stringify(editedUser)) {
      if (window.confirm("Are you sure you want to discard your changes?")) {
        setIsEditing(false);
        setEditedUser(JSON.parse(JSON.stringify(user))); // Reset to current user data
        setFormState((prev) => ({
          ...prev.validationErrors,
          touchedFields: {},
        }));
      }
    } else {
      // No changes made, just exit edit mode
      setIsEditing(false);
    }
  };

  const updateFormState = (updates: Partial<typeof formState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  if (loading) {
    return <LoadingSpinner size="sm" text="Loading user profile..." />;
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
            <ProfileImage user={user} />

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex justify-between">
                <div>
                  {isEditing ? (
                    <div className="mb-4">
                      <Input
                        value={editedUser?.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={getInputClassName(
                          "user",
                          "name",
                          "font-semibold"
                        )}
                        placeholder="Your Name*"
                      />
                      {isFieldTouched("user", "name") &&
                        getFieldError("user", "name") && (
                          <p className="text-red-500 text-xs mt-1">
                            {getFieldError("user", "name")}
                          </p>
                        )}
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                  )}

                  {isEditing ? (
                    <div className="mb-4">
                      <Input
                        value={editedUser?.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className={getInputClassName(
                          "user",
                          "title",
                          "text-lg text-muted-foreground"
                        )}
                        placeholder="Your Title (e.g. Software Developer)"
                      />
                      {isFieldTouched("user", "title") &&
                        getFieldError("user", "title") && (
                          <p className="text-red-500 text-xs mt-1">
                            {getFieldError("user", "title")}
                          </p>
                        )}
                    </div>
                  ) : (
                    <p className="text-lg text-muted-foreground">
                      {user?.title || "Software Developer"}
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
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {isEditing ? (
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
                        placeholder="Your Location"
                      />
                    ) : (
                      user?.location || "San Francisco, CA"
                    )}
                  </div>
                  {isFieldTouched("user", "location") &&
                    getFieldError("user", "location") && (
                      <p className="text-red-500 text-xs mt-1 ml-6">
                        {getFieldError("user", "location")}
                      </p>
                    )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  {user?.email} {/* Email is not editable */}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    {isEditing ? (
                      <Input
                        value={editedUser?.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`${getInputClassName(
                          "user",
                          "phone",
                          "text-sm"
                        )} ${
                          formState.phoneError
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        placeholder="Your Phone Number (Optional)"
                        aria-invalid={!!formState.phoneError}
                      />
                    ) : (
                      user?.phone || "No phone number provided"
                    )}
                  </div>
                  {formState.phoneError && (
                    <p className="text-red-500 text-xs mt-1 ml-6 font-medium">
                      {formState.phoneError}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {isEditing ? (
                      <div className="flex items-center space-x-4">
                        <div
                          className={`cursor-pointer px-3 py-1 rounded-full text-xs ${
                            editedUser?.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => handleAvailabilityToggle(true)}
                        >
                          Available for work
                        </div>
                        <div
                          className={`cursor-pointer px-3 py-1 rounded-full text-xs ${
                            editedUser?.isAvailable === false
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => handleAvailabilityToggle(false)}
                        >
                          Not available
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user?.isAvailable
                            ? "bg-green-100 text-green-800"
                            : user?.isAvailable === false
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user?.isAvailable
                          ? "Available for new opportunities"
                          : user?.isAvailable === false
                          ? "Not available for work"
                          : "Availability status not set"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                {isEditing ? (
                  <div>
                    <Textarea
                      value={editedUser?.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className={getInputClassName("user", "bio", "text-sm")}
                      placeholder="Write a short bio about yourself"
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
                  <p className="text-sm">
                    {user?.bio ||
                      "Experienced software developer with a passion for building scalable web applications. Specialized in React, Node.js, and cloud technologies."}
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
