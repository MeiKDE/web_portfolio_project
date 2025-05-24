"use client";
import { Profile } from "../profile.types";

export const ProfileItem = ({ profile }: { profile: Profile }) => {
  console.log("Profile data:", profile); // Debug log to see what data we're receiving

  return (
    <div className="flex items-center justify-between w-full">
      <div className="w-full">
        <h4 className="font-medium">{profile.name}</h4>
        <p className="text-sm text-muted-foreground">{profile.title}</p>
        <p className="mt-2 text-sm whitespace-pre-wrap">{profile.bio}</p>
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <span>Location: {profile.location}</span>
            {profile.phone && (
              <>
                <span className="mx-2">•</span>
                <span>Phone: {profile.phone}</span>
              </>
            )}
            <span className="mx-2">•</span>
            <span>Email: {profile.profile_email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
