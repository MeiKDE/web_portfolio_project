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

    // For returning users (completed profile setup), redirect to home/profile page
    redirect("/profile");
  } else {
    // For non-logged in users, also redirect to home/profile page
    redirect("/profile");
  }
}
