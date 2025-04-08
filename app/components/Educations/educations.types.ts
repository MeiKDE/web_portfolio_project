import { BaseEntity, Describable, Institution } from "@/app/types/common.types";

export interface Education extends BaseEntity, Describable, Institution {
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  institution: string; // Override optional institution
}
