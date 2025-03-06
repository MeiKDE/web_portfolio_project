"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Edit, Save, Lightbulb } from "lucide-react";
import useSWR from "swr";

interface UserProps {
  userId: string;
}

interface User {
  id: string;
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImageUrl: string;
  aiGeneratedTagline: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function User({ userId }: UserProps) {
  const {
    data: userData,
    error,
    isLoading,
    mutate,
  } = useSWR<User>(`/api/users/${userId}`, fetcher);
  const [editable, setEditable] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    if (userData) {
      setEditedUser(userData);
    }
  }, [userData]);

  const handleEditToggle = () => {
    if (editable) {
      saveChanges();
    }
    setEditable(!editable);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value });
    }
  };

  const saveChanges = async () => {
    if (!editedUser) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const updatedUser = await response.json();
      setEditedUser(updatedUser);
      mutate(); // Re-fetch data to ensure consistency
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  if (isLoading) return <div>Loading user profile...</div>;
  if (error) return <div>Error loading user profile: {error.message}</div>;
  if (!userData) return <div>No user data available</div>;

  return (
    <>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={
                    userData.profileImageUrl ||
                    "/placeholder.svg?height=128&width=128"
                  }
                  alt="Profile picture"
                />
                <AvatarFallback>
                  {userData.name ? userData.name.charAt(0) : "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  {editable ? (
                    <input
                      type="text"
                      value={editedUser?.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">
                      {userData.name || "Loading..."}
                    </h1>
                  )}
                  {editable ? (
                    <input
                      type="text"
                      value={editedUser?.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="text-xl text-muted-foreground"
                    />
                  ) : (
                    <h2 className="text-xl text-muted-foreground">
                      {userData.title || "Loading..."}
                    </h2>
                  )}
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {editable ? (
                      <input
                        type="text"
                        value={editedUser?.location || ""}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="text-muted-foreground"
                      />
                    ) : (
                      <span>{userData.location || "Loading..."}</span>
                    )}
                  </div>
                </div>
                {editable ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                  >
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Done
                    </>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                  >
                    {" "}
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  </Button>
                )}
              </div>
              <div className="mt-4">
                {editable ? (
                  <textarea
                    value={editedUser?.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full"
                    rows={4}
                  />
                ) : (
                  <p>{userData.bio || "Loading..."}</p>
                )}
              </div>
              <div className="mt-2 p-3 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  {editable ? (
                    <textarea
                      value={editedUser?.aiGeneratedTagline || ""}
                      onChange={(e) =>
                        handleInputChange("aiGeneratedTagline", e.target.value)
                      }
                      className="w-full text-sm italic"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm italic">
                      {userData.aiGeneratedTagline || "AI-generated tagline"}
                      <span className="block text-xs text-muted-foreground mt-1">
                        AI-generated tagline
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
