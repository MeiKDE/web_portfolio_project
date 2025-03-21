import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Github, Linkedin, Twitter, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface SocialLinksProps {
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export default function SocialLinks({
  githubUrl = "github.com/janedoe",
  linkedinUrl = "linkedin.com/in/janedoe",
  twitterUrl = "twitter.com/janedoe",
  websiteUrl = "janedoe.dev",
}: SocialLinksProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Connect with Me</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Github className="h-5 w-5" />
          <a
            href={`https://${githubUrl}`}
            className="text-primary hover:underline"
          >
            {githubUrl}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Linkedin className="h-5 w-5" />
          <a
            href={`https://${linkedinUrl}`}
            className="text-primary hover:underline"
          >
            {linkedinUrl}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Twitter className="h-5 w-5" />
          <a
            href={`https://${twitterUrl}`}
            className="text-primary hover:underline"
          >
            {twitterUrl}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5" />
          <a
            href={`https://${websiteUrl}`}
            className="text-primary hover:underline"
          >
            {websiteUrl}
          </a>
        </div>
      </div>
      <Button className="w-full">Send Message</Button>
    </>
  );
}
