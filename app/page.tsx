import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import ResumeUpload from "@/app/components/common/ResumeUpload";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/lib/services/user-service";

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
