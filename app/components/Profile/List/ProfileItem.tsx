import React from "react";

interface Profile {
  name: string;
  title: string;
  description: string;
}

export const ProfileItem = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{profile.name}</h4>
        <p className="text-sm text-muted-foreground">{profile.title}</p>
        <p className="mt-1 text-sm">{profile.description}</p>
      </div>
    </div>
  );
};
