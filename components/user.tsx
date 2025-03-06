"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Edit, Lightbulb } from "lucide-react";
import useSWR from "swr";
import Skills from "@/components/skills";

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
  } = useSWR<User>(`/api/users/${userId}`, fetcher);

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
                  <h1 className="text-2xl font-bold">
                    {userData.name || "Loading..."}
                  </h1>
                  <h2 className="text-xl text-muted-foreground">
                    {userData.title || "Loading..."}
                  </h2>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.location || "Loading..."}</span>
                  </div>
                </div>
                <Button className="w-full sm:w-auto" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <div className="mt-4">
                <p>{userData.bio || "Loading..."}</p>
              </div>
              <div className="mt-2 p-3 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm italic">
                    {userData.aiGeneratedTagline || "AI-generated tagline"}
                    <span className="block text-xs text-muted-foreground mt-1">
                      AI-generated tagline
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Skills component */}
      <div className="mb-8">
        <Skills userId={userId} />
      </div>
    </>
  );
}
