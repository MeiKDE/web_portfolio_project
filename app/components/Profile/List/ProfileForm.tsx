import { Profile } from "../profile.types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormProps {
  profile: Profile;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isValid: boolean
  ) => void;
}

export const ProfileForm = ({ profile, onFormChange }: ProfileFormProps) => {
  const handleChange = (field: string, value: string) => {
    // Simple validation - check if required fields are not empty
    const isValid = value.trim() !== "";
    onFormChange(profile.id, field, value, isValid);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={profile.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={profile.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter your title"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Bio</label>
        <Textarea
          value={profile.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          placeholder="Enter your bio"
          className="min-h-[100px]"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Location</label>
        <Input
          value={profile.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Enter your location"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Phone</label>
        <Input
          value={profile.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          value={profile.profile_email}
          onChange={(e) => handleChange("profile_email", e.target.value)}
          placeholder="Enter your email"
          type="email"
        />
      </div>
    </div>
  );
};
