"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Import UI components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, Lightbulb, CheckCircle, X, Upload } from "lucide-react";

// Import profile components - UPDATED PATHS
import ProfileHeader from "@/app/profile/components/ProfileHeader";
import ExperienceSection from "@/app/profile/components/ExperienceSection";
import EducationSection from "@/app/profile/components/EducationSection";
import SkillsSection from "@/app/profile/components/SkillsSection";
import CertificationsSection from "@/app/profile/components/CertificationsSection";
import SocialLinksSection from "@/app/profile/components/SocialLinksSection";
import ResumeUpload from "@/components/common/ResumeUpload"; // Keep shared version

// Add this near the top of the file
// we need below interface to be able to use the user profile data in the profile page
// the ... is used to extend the type with the additional properties

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
  const [fetchError, setFetchError] = useState<string | null>(null);

  // useRef code means that the hasFetchAttempted is a ref that is initialized to false
  // we can use this ref to track if we've already attempted a fetch in this session
  // what's the point of using useRef here?
  // useRef is used to store a value that is not needed for rendering, to be cached in the browser
  const hasFetchAttempted = useRef(false);
  console.log("session", session);
  // fetchUserProfile is a function that fetches the user profile
  // it is a useCallback function which is cached in the browser and not recreated on each render
  const fetchUserProfile = useCallback(
    async (id: string) => {
      try {
        // If we've already attempted a fetch, don't try again
        // hasFetchAttempted.current equals false, so we don't try again
        if (hasFetchAttempted.current) return;

        hasFetchAttempted.current = true; // set to true
        setIsLoading(true);
        setFetchError(null);

        const response = await fetch(`/api/profile?id=${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await response.json(); // this means that the data is a json object

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch profile data");
        }

        setUserProfile(data.data); // this means that the userProfile is set to the data.data

        // If user hasn't completed profile setup, redirect to homepage
        // hasCompletedProfileSetup value is false, so we redirect to the homepage
        if (!data.data?.hasCompletedProfileSetup) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setFetchError(
          error instanceof Error ? error.message : "Failed to fetch profile"
        );

        // Reset the fetch attempt flag after some delay to allow retry
        setTimeout(() => {
          hasFetchAttempted.current = false; // set to false
        }, 5000); // 5 second cool down before allowing another fetch attempt
      } finally {
        setIsLoading(false);
      }
    },
    [router] // this means that the fetchUserProfile function is a dependency of the useEffect hook
  );

  useEffect(() => {
    // Only redirect if session is definitely not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Only fetch if authenticated and we have a user ID
    if (
      status === "authenticated" &&
      session?.user?.id &&
      !hasFetchAttempted.current
    ) {
      fetchUserProfile(session.user.id);
    }
  }, [status, session, router, fetchUserProfile]); // this means that the useEffect hook is a dependency of the fetchUserProfile function

  // this useEffect is used to auto-dismiss the message after 5 seconds
  useEffect(() => {
    if (userProfile?.isUploadResumeForProfile && showResumeMessage) {
      const timer = setTimeout(() => {
        setShowResumeMessage(false);
      }, 5000); // Message will disappear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [userProfile?.isUploadResumeForProfile, showResumeMessage]);

  // Show loading spinner while checking auth status or fetching profile
  if (status === "loading" || (isLoading && !hasFetchAttempted.current)) {
    return <LoadingSpinner fullPage text="Loading your profile..." />;
  }

  // Don't render anything if not authenticated (router will redirect)
  if (status === "unauthenticated") {
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

  // Wait for profile data before rendering
  if (!userProfile && !hasFetchAttempted.current) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold">Profile not found</h2>
        <p className="mt-2 text-gray-600">
          We couldn't retrieve your profile information.
        </p>
        <Button
          className="mt-4"
          onClick={() => {
            if (session?.user?.id) {
              hasFetchAttempted.current = false;
              fetchUserProfile(session.user.id);
            }
          }}
        >
          Retry
        </Button>
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
      {session?.user?.id && <ProfileHeader userId={session.user.id} />}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Resume */}
        <div className="md:col-span-2 space-y-8">
          {/* Experience Section */}
          {session?.user?.id && <ExperienceSection userId={session.user.id} />}

          {/* Education Section */}
          {session?.user?.id && <EducationSection userId={session.user.id} />}

          {/* Skills Section */}
          {session?.user?.id && <SkillsSection userId={session.user.id} />}

          {/* Certifications Section */}
          {session?.user?.id && (
            <CertificationsSection userId={session.user.id} />
          )}
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
              <SocialLinksSection />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
