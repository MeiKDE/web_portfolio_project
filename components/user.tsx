"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Mail, Phone, Calendar, Save, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { userSchema } from "@/lib/validations"; // Import the user validation schema
import { z } from "zod";
import { userProfileSchema } from "@/lib/validations"; // We'll create this schema

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

  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        setError(null);
        const response = await fetch("/api/users/me");
        console.log("ln41: response", response);
        if (!response.ok) throw new Error("Failed to fetch user");
        const userData = await response.json();
        setUser(userData);
        setEditedUser(JSON.parse(JSON.stringify(userData))); // Deep copy for editing
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
      console.log("ln59: isEditing", isEditing);
      saveChanges();
    } else {
      console.log("ln62: isEditing", isEditing);
      setEditedUser(JSON.parse(JSON.stringify(user))); // Reset to current user data
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    if (!editedUser) return;
    console.log("ln70: field", field);
    setEditedUser({
      ...editedUser,
      [field]: value,
    });
  };

  const saveChanges = async () => {
    if (!editedUser) return;

    try {
      // Validate the edited user data using Zod
      userProfileSchema.parse(editedUser);

      setIsSubmitting(true);
      setError(null);
      setValidationErrors(null);

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedUser.name,
          title: editedUser.title,
          location: editedUser.location,
          phone: editedUser.phone,
          bio: editedUser.bio,
        }),
      });

      console.log("ln98: response", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      console.log("ln106: updatedUser", updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
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
  };

  if (loading) {
    return <div>Loading user profile...</div>;
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
                  alt={user.name}
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
                  <Input
                    value={editedUser?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-2xl font-bold mb-2"
                    placeholder="Your Name"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                )}

                {isEditing ? (
                  <Input
                    value={editedUser?.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="text-lg text-muted-foreground"
                    placeholder="Your Title (e.g. Software Developer)"
                  />
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
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {isEditing ? (
                  <Input
                    value={editedUser?.location || ""}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="text-sm"
                    placeholder="Your Location"
                  />
                ) : (
                  user.location || "San Francisco, CA"
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {user.email} {/* Email is not editable */}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                {isEditing ? (
                  <Input
                    value={editedUser?.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="text-sm"
                    placeholder="Your Phone Number"
                  />
                ) : (
                  user.phone || "+1 (555) 123-4567"
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Available for new opportunities
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              {isEditing ? (
                <Textarea
                  value={editedUser?.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="text-sm"
                  placeholder="Write a short bio about yourself"
                  rows={4}
                />
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
