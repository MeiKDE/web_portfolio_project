export interface Education {
  id: string;
  institution: string;
  institutionLogoUrl?: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
