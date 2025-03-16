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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
      p: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >;
      h1: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
    }
  }
}

export default function User({ userId }: UserProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<z.ZodIssue[] | null>(
    null
  );
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

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
        setError(null);
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
        setError("Failed to load user profile. Please try again.");
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
    // Update your state
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));

    // Mark field as touched
    touchField("user", field as string);

    // Validate if we have an edited user
    if (editedUser) {
      validateData(
        {
          ...editedUser,
          [field]: value,
        },
        "user"
      );
    }
  };

  const handleAvailabilityToggle = (isAvailable: boolean) => {
    if (!editedUser) return;
    setEditedUser({
      ...editedUser,
      isAvailable,
    });

    // Mark field as touched
    setTouchedFields({
      ...touchedFields,
      isAvailable: true,
    });
  };

  const saveChanges = async () => {
    if (!editedUser) return;

    // Mark all fields as touched when attempting to save
    setTouchedFields({
      name: true,
      title: true,
      location: true,
      bio: true,
      phone: true,
      isAvailable: true,
    });

    try {
      // Validate the edited user data using Zod
      const validatedData = userProfileSchema.parse(editedUser);

      setIsSubmitting(true);
      setError(null);
      setValidationErrors(null);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const { data: updatedUser } = await response.json();
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setIsEditing(false);
      // Reset touched fields after successful save
      setTouchedFields({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.issues);
        return;
      }
      console.error("Error saving changes:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(JSON.parse(JSON.stringify(user))); // Reset to current user data
    setValidationErrors(null);
    setTouchedFields({});
  };

  if (loading) {
    return <LoadingSpinner size="sm" text="Loading user profile..." />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>

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
                  <h1 className="text-2xl font-bold">{user.name}</h1>
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
                    {user.title || "Software Developer"}
                  </p>
                )}
              </div>

              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveChanges}
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEditToggle}>
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
                    user.location || "San Francisco, CA"
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
                {user.email} {/* Email is not editable */}
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
                      className={getInputClassName("user", "phone", "text-sm")}
                      placeholder="Your Phone Number"
                    />
                  ) : (
                    user.phone || "+1 (555) 123-4567"
                  )}
                </div>
                {isFieldTouched("user", "phone") &&
                  getFieldError("user", "phone") && (
                    <p className="text-red-500 text-xs mt-1 ml-6">
                      {getFieldError("user", "phone")}
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
                  {user.bio ||
                    "Experienced software developer with a passion for building scalable web applications. Specialized in React, Node.js, and cloud technologies."}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
