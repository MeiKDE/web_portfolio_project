import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Lightbulb, CheckCircle, X } from "lucide-react";
import Educations from "@/components/Educations";
import Experiences from "@/components/Experiences";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import User from "@/components/User";
import SocialLinks from "@/components/SocialLinks";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ResumeUpload from "@/components/ResumeUpload";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/user-service";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is logged in, check if they're a new user
  if (session?.user) {
    const userProfile = await getUserProfile(session.user.id);

    // If user hasn't completed profile setup, show the resume upload prompt
    if (!userProfile?.hasCompletedProfileSetup) {
      return <ResumeUpload />;
    }
  }

  // Regular homepage content for returning users or non-logged in users
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">Welcome to Resume Builder</h1>
        {/* ... other content ... */}
      </div>
    </main>
  );
}
