"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

// Import UI components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Lightbulb, CheckCircle, X, Upload } from "lucide-react";

// Import profile components
import UserProfile from "@/components/User";
import Experiences from "@/components/Experiences";
import Educations from "@/components/Educations";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import SocialLinks from "@/components/SocialLinks";
import ResumeUpload from "@/components/ResumeUpload";

// Add this near the top of the file
interface UserProfileType {
  id: string;
  hasCompletedProfileSetup?: boolean;
  isUploadResumeForProfile?: boolean;
  // Add other profile properties as needed
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResumeMessage, setShowResumeMessage] = useState(true);
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  useEffect(() => {
    // Handle authentication
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
      return;
    }

    // Once authenticated, fetch user profile data
    if (status === "authenticated" && session?.user?.id) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(
            `/api/profile?userId=${session.user.id}`
          );
          if (!response.ok) throw new Error("Failed to fetch profile");

          const data = await response.json();
          setUserProfile(data);

          // If user hasn't completed profile setup, redirect to homepage
          if (!data?.hasCompletedProfileSetup) {
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [status, session, router]);

  // Add new useEffect for auto-dismissing message
  useEffect(() => {
    if (userProfile?.isUploadResumeForProfile && showResumeMessage) {
      const timer = setTimeout(() => {
        setShowResumeMessage(false);
      }, 5000); // Message will disappear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [userProfile?.isUploadResumeForProfile, showResumeMessage]);

  // Show loading spinner while checking auth status or fetching profile
  if (status === "loading" || isLoading) {
    return <LoadingSpinner fullPage text="Loading your profile..." />;
  }

  // Don't render anything if not authenticated (router will redirect)
  if (!session || !session.user) {
    return null;
  }

  if (showResumeUpload) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ResumeUpload
          fromProfile={true}
          onClose={() => setShowResumeUpload(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {userProfile?.isUploadResumeForProfile && showResumeMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative">
          <p>
            Your profile has been populated from your resume. Feel free to make
            any adjustments needed.
          </p>
          <button
            onClick={() => setShowResumeMessage(false)}
            className="absolute top-2 right-2 text-green-700 hover:text-green-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Update Upload Resume Button to use state instead of Link */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowResumeUpload(true)}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Your Resume
        </button>
      </div>

      {/* Profile Header */}
      <UserProfile userId={session.user.id} />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Resume */}
        <div className="md:col-span-2 space-y-8">
          {/* Experience Section */}
          <Experiences userId={session.user.id} />

          {/* Education Section */}
          <Educations userId={session.user.id} />

          {/* Skills Section */}
          <Skills userId={session.user.id} />

          {/* Certifications Section */}
          <Certifications userId={session.user.id} />
        </div>

        {/* Right Column - Portfolio, Cover Letter, Contact */}
        <div className="space-y-8">
          {/* Portfolio Showcase */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Portfolio Showcase</h3>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                  <TabsTrigger value="backend">Backend</TabsTrigger>
                  <TabsTrigger value="fullstack">Full Stack</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">E-commerce Platform</h4>
                      <p className="text-sm text-muted-foreground">
                        Full Stack · React, Node.js, MongoDB
                      </p>
                      <p className="text-sm mt-2">
                        A complete e-commerce solution with payment processing
                        and inventory management.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">
                        Real-time Analytics Dashboard
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Frontend · React, D3.js, WebSockets
                      </p>
                      <p className="text-sm mt-2">
                        Interactive dashboard for visualizing real-time data
                        streams.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">API Gateway Service</h4>
                      <p className="text-sm text-muted-foreground">
                        Backend · Node.js, Express, Redis
                      </p>
                      <p className="text-sm mt-2">
                        Microservice gateway with rate limiting and caching
                        capabilities.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="frontend" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">
                        Real-time Analytics Dashboard
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Frontend · React, D3.js, WebSockets
                      </p>
                      <p className="text-sm mt-2">
                        Interactive dashboard for visualizing real-time data
                        streams.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="backend" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">API Gateway Service</h4>
                      <p className="text-sm text-muted-foreground">
                        Backend · Node.js, Express, Redis
                      </p>
                      <p className="text-sm mt-2">
                        Microservice gateway with rate limiting and caching
                        capabilities.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="fullstack" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">E-commerce Platform</h4>
                      <p className="text-sm text-muted-foreground">
                        Full Stack · React, Node.js, MongoDB
                      </p>
                      <p className="text-sm mt-2">
                        A complete e-commerce solution with payment processing
                        and inventory management.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* AI Suggestion */}
              <div className="mt-4 p-3 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium">AI Suggestion:</p>
                    <p className="text-sm">
                      Based on your skills, consider adding a GraphQL project to
                      showcase your expertise in this technology.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Create Project
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Social Links */}
          <Card>
            <CardContent className="p-6">
              <SocialLinks />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
