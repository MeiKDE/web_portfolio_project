import { BaseEntity, TrackableUI } from "@/app/types/common.types";

export interface Profile extends BaseEntity, TrackableUI {
  name: string;
  title: string;
  bio: string;
  location: string;
  phone?: string;
  profile_email: string;
  profileImageUrl?: string;
  hasCompletedProfileSetup: boolean;
  isUploadResumeForProfile: boolean;
}
