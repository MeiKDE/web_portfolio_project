import { BaseEntity, TrackableUI } from "@/app/types/common.types";

export interface Skill extends BaseEntity, TrackableUI {
  name: string;
  proficiencyLevel: number;
  category: string;
}
