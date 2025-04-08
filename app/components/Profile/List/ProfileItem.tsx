import React from "react";

interface Profile {
  name: string;
  title: string;
  description: string;
  location: string;
  phone?: string;
  profile_email: string;
}

export const ProfileItem = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h4 className="font-medium">{profile.name}</h4>
        <p className="text-sm text-muted-foreground">{profile.title}</p>
        <p className="mt-1 text-sm">{profile.description}</p>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Location:</span>
          <span className="text-sm text-muted-foreground">
            {profile.location}
          </span>
        </div>
        {profile.phone && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Phone:</span>
            <span className="text-sm text-muted-foreground">
              {profile.phone}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Contact Email:</span>
          <span className="text-sm text-muted-foreground">
            {profile.profile_email}
          </span>
        </div>
      </div>
    </div>
  );
};
