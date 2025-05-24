import { BaseEntity } from "@/app/types/common.types";

export interface Skill extends BaseEntity {
  name: string;
  category?: string;
  proficiencyLevel: number;
}
