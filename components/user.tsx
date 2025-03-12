"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Mail, Phone, Calendar } from "lucide-react";
import Image from "next/image";

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

  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        // You can use the /api/auth/me endpoint or create a specific endpoint
        const response = await fetch("/api/auth/me");
        if (!response.ok) throw new Error("Failed to fetch user");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading user profile...</div>;
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
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {user.title || "Software Developer"}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Contact & Location */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {user.location || "San Francisco, CA"}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                {user.phone || "+1 (555) 123-4567"}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Available for new opportunities
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <p className="text-sm">
                {user.bio ||
                  "Experienced software developer with a passion for building scalable web applications. Specialized in React, Node.js, and cloud technologies."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
