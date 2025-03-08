"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Edit,
  Github,
  Linkedin,
  Twitter,
  Globe,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  X,
  LogOut,
} from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useState, useEffect } from "react";
import Educations from "@/components/educations";
import Experiences from "@/components/experiences";
import Skills from "@/components/skills";
import Certifications from "@/components/certifications";
import User from "@/components/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Portfolio App</h1>

        <div>
          <p className="mb-4">Please log in to access your portfolio.</p>
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile Header - Replace with User component */}
        <User userId={session.user.id || ""} />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Resume */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience Section */}
            <Experiences userId={session.user.id || ""} />

            {/* Education Section */}
            <Educations userId={session.user.id || ""} />

            {/* Skills Section */}
            <Skills userId={session.user.id || ""} />

            {/* Certifications Section */}
            <Certifications userId={session.user.id || ""} />
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
                        Based on your skills, consider adding a GraphQL project
                        to showcase your expertise in this technology.
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
                <h3 className="text-xl font-semibold mb-4">Contact & Social</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5" />
                    <a href="#" className="text-primary hover:underline">
                      github.com/janedoe
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5" />
                    <a href="#" className="text-primary hover:underline">
                      linkedin.com/in/janedoe
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="h-5 w-5" />
                    <a href="#" className="text-primary hover:underline">
                      twitter.com/janedoe
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    <a href="#" className="text-primary hover:underline">
                      janedoe.dev
                    </a>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
