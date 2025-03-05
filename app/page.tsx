"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
} from "lucide-react"
import { useUser } from '@/lib/hooks/useUser';
import { useEffect, useState } from 'react';
import Education from "@/components/education";
import Experience from "@/components/experience";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => {
  // console.log("ln4: response from fetcher", res);
  return res.json()});

export default function ProfilePage() {
  const { user, isLoading, isError } = useUser("cm7vaqj1i0000mwytdesnb2f7"); 

  // const [experiences, setExperiences] uses array destructuring returns an array with two elements:
  // The current state value (in this case, experiences).
  // A function to update that state (in this case, setExperiences).
  // <any[]>: This is a type annotation that tells TypeScript that the experiences state can hold an array of any type.
  // []: This is the initial value of the experiences state. It's an empty array of any type.
  const [experiences, setExperiences] = useState<any[]>([]);


  // React Hook returns 2 values:
  // The current state value (in this case, error).
  // A function to update that state (in this case, setError).
  // <string | null>: This is a type annotation that tells TypeScript that the error state can hold a string or null.
  // null: This is the initial value of the error state. It's a null value. 
  const [error, setError] = useState<string | null>(null);

  // useSWR Hook returns 4 values:
  // The current state value (in this case, education).
  // The current state value (in this case, educationError).
  // The current state value (in this case, isEducationLoading).
  // A function to update that state (in this case, educationMutate).
  const { data: education, error: educationError, isLoading: isEducationLoading, mutate:  educationMutate } = useSWR(
    `/api/users/cm7vaqj1i0000mwytdesnb2f7/education`,
    fetcher
  );
  // console.log(`ln41: education from useSWR`, education);
  // console.log(`ln42: educationError from useSWR`, educationError);
  // console.log(`ln43: isEducationLoading from useSWR`, isEducationLoading);
  // console.log(`ln44: educationMutate from useSWR`, educationMutate);  


  // useEffect Hook: runs data fetching or side effects after a component mounts/renders.
  // The empty dependency array ([]) means it runs only once

  // One-Time Fetch: Runs once on mount due to [].
  // Error Handling: Robustly manages fetch failures.
  // One-Time Fetch: Runs once on mount due to [].
  // Error Handling: Robustly manages fetch failures.
  // State Updates: Updates UI via state changes.
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };

    fetchExperiences();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.profileImageUrl || "/placeholder.svg?height=128&width=128"} alt="Profile picture" />
                <AvatarFallback>{user.name ? user.name.charAt(0) : "?"}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.name || "Loading..."}</h1>
                  <h2 className="text-xl text-muted-foreground">{user.title || "Loading..."}</h2>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{user.location || "Loading..."}</span>
                  </div>
                </div>
                <Button className="w-full sm:w-auto" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <div className="mt-4">
                <p>{user.bio || "Loading..."}</p>
              </div>
              <div className="mt-2 p-3 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm italic">
                    {user.aiGeneratedTagline || "AI-generated tagline"}
                    <span className="block text-xs text-muted-foreground mt-1">AI-generated tagline</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Resume */}
        <div className="md:col-span-2 space-y-8">
          {/* Experience Section */}
          <Experience userId="cm7vaqj1i0000mwytdesnb2f7" />

          {/* Education Section */}
          <Education 
            education={education}
          />

          {/* Skills Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Skills</h3>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  React
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  Node.js
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  TypeScript
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  AWS
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  GraphQL
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  MongoDB
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  PostgreSQL
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  Docker
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  Kubernetes
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  CI/CD
                </Badge>
              </div>

              {/* AI Suggestion */}
              <div className="mt-4 p-3 bg-muted rounded-md border border-border">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium">AI Suggestion:</p>
                    <p className="text-sm">
                      Consider adding "Next.js" to your skills based on your experience. It's a popular framework that
                      would complement your React expertise.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Add Skill
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <X className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Certifications</h3>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                    <CheckCircle className="h-4 w-4" />
                  </Badge>
                  <div>
                    <h4 className="font-medium">AWS Certified Solutions Architect</h4>
                    <p className="text-sm text-muted-foreground">Amazon Web Services · Issued Jan 2022</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                    <CheckCircle className="h-4 w-4" />
                  </Badge>
                  <div>
                    <h4 className="font-medium">Google Cloud Professional Developer</h4>
                    <p className="text-sm text-muted-foreground">Google · Issued Mar 2021</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                      <p className="text-sm text-muted-foreground">Full Stack · React, Node.js, MongoDB</p>
                      <p className="text-sm mt-2">
                        A complete e-commerce solution with payment processing and inventory management.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Real-time Analytics Dashboard</h4>
                      <p className="text-sm text-muted-foreground">Frontend · React, D3.js, WebSockets</p>
                      <p className="text-sm mt-2">Interactive dashboard for visualizing real-time data streams.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">API Gateway Service</h4>
                      <p className="text-sm text-muted-foreground">Backend · Node.js, Express, Redis</p>
                      <p className="text-sm mt-2">Microservice gateway with rate limiting and caching capabilities.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="frontend" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Real-time Analytics Dashboard</h4>
                      <p className="text-sm text-muted-foreground">Frontend · React, D3.js, WebSockets</p>
                      <p className="text-sm mt-2">Interactive dashboard for visualizing real-time data streams.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="backend" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">API Gateway Service</h4>
                      <p className="text-sm text-muted-foreground">Backend · Node.js, Express, Redis</p>
                      <p className="text-sm mt-2">Microservice gateway with rate limiting and caching capabilities.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="fullstack" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">E-commerce Platform</h4>
                      <p className="text-sm text-muted-foreground">Full Stack · React, Node.js, MongoDB</p>
                      <p className="text-sm mt-2">
                        A complete e-commerce solution with payment processing and inventory management.
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
                      Based on your skills, consider adding a GraphQL project to showcase your expertise in this
                      technology.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Create Project
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <X className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Generated Cover Letter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">AI Cover Letter</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate a custom cover letter based on your profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="p-4 border rounded-md bg-muted/50">
                <p className="text-sm italic text-muted-foreground">
                  Generate a custom cover letter for your job applications based on your resume and the job description.
                </p>
                <Button className="mt-3 w-full">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Create Cover Letter
                </Button>
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
              <Button className="w-full mt-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                Hire Me
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

