"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Mail, Phone, Calendar, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fetchController = useRef<AbortController | null>(null);
  const hasFetched = useRef(false);

  // Use the form validation hook with the userProfileSchema
  const {
    validateData,
    getFieldError,
    touchField,
    isFieldTouched,
    getInputClassName,
  } = useFormValidation(userProfileSchema);

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
      setError(null);
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
        setError("Failed to load user profile. Please try again.");
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

    // Mark field as touched and validate
    touchField("user", field);

    // Create a validation object with just the updated field
    const fieldUpdate = { ...editedUser, [field]: value };
    validateData(fieldUpdate, "user");
  };

  const handleAvailabilityToggle = (isAvailable: boolean) => {
    if (!editedUser) return;
    setEditedUser({
      ...editedUser,
      isAvailable,
    });

    // Mark field as touched
    touchField("user", "isAvailable");

    // Validate the updated data
    const updatedUser = { ...editedUser, isAvailable };
    validateData(updatedUser, "user");
  };

  const saveChanges = async () => {
    console.log("saveChanges function called");
    if (!editedUser || !user) {
      console.log("editedUser or user is null, exiting");
      return;
    }

    try {
      // Create a copy of editedUser for validation purposes
      const validationUser = { ...editedUser };

      // If image field is present but empty or not a valid URL, remove it for validation
      if (validationUser.image !== undefined) {
        if (validationUser.image === "" || validationUser.image === null) {
          // If empty, remove from validation since it's optional
          console.log("Image is empty, removing for validation");
          delete validationUser.image;
        } else {
          // If not empty, check if it's a valid URL
          try {
            new URL(validationUser.image); // This will throw if not a valid URL
          } catch (e) {
            console.log(
              "Image URL is invalid, removing for validation:",
              validationUser.image
            );
            // Remove image from validation copy only, not the actual data
            delete validationUser.image;
          }
        }
      }

      // Validate all fields and mark them as touched
      Object.keys(editedUser).forEach((field) => {
        touchField("user", field);
        console.log("valid error", field, getFieldError("user", field));
      });

      // Validate the entire form with the modified validation object
      const isValid = validateData(validationUser, "user");
      console.log("check isValid", isValid);

      // Check for phone error as well
      if (!isValid || phoneError) {
        // Scroll to the first error if there is one
        const firstErrorElement = document.querySelector(".border-red-500");
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      }

      console.log("Proceeding with API call");
      setIsSubmitting(true);
      setError(null);

      // Create a sanitized copy of the user data
      const sanitizedUserData = { ...editedUser };

      // Handle empty strings for profile_email (omit if empty)
      if (sanitizedUserData.profile_email === "") {
        delete sanitizedUserData.profile_email;
      }

      // Handle empty string for image (omit if empty)
      if (sanitizedUserData.image === "") {
        delete sanitizedUserData.image;
      }

      // Log the data being sent (for debugging)
      console.log("Sending data to API:", sanitizedUserData);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedUserData),
        cache: "no-store", // Next.js convention to avoid caching
      });

      console.log("ln233: response", response);

      // Check response and handle potential empty response
      if (!response.ok) {
        let errorMessage = "Failed to update profile";

        try {
          // Only try to parse JSON if we have a content-type that indicates JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            // If not JSON, get text instead
            errorMessage = (await response.text()) || errorMessage;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          // Use status text as fallback error message
          errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Parse successful response
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error("Error parsing success response:", parseError);
        throw new Error("Invalid response from server");
      }

      // Handle successful response based on API helper format
      if (responseData.success && responseData.data) {
        console.log("Profile updated successfully:", responseData.data);
        setUser(responseData.data);
        setEditedUser(JSON.parse(JSON.stringify(responseData.data)));
        setIsEditing(false);
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        throw new Error("Invalid response structure from API");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(JSON.parse(JSON.stringify(user)));
    setPhoneError(null);
    setError(null);
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
    setPhoneError(isValid ? null : "Please enter a valid phone number");
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
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
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
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Name <span className="text-red-500">*</span>
                      </label>
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
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Professional Title
                      </label>
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
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        console.log("Save button clicked");
                        saveChanges();
                      }}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Saving..." : "Save"}
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
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Location
                      </label>
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
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
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
                      <label className="text-sm text-muted-foreground mb-1 block">
                        Phone Number
                      </label>
                      <PhoneInput
                        value={editedUser?.phone || ""}
                        onChange={handlePhoneChange}
                        className={
                          phoneError ? "border-red-500 text-sm" : "text-sm"
                        }
                        error={phoneError}
                      />
                      {phoneError && (
                        <p className="text-red-500 text-xs mt-1">
                          {phoneError}
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

              {/* Required fields note */}
              {isEditing && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <span className="text-red-500">*</span> Required fields
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
