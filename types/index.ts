// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  profile_email?: string;
  image?: string;
  title?: string;
  location?: string;
  phone?: string;
  bio?: string;
  isAvailable?: boolean;
}

// Experience related types
export interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
  location: string;
  isCurrentPosition: boolean;
  userId?: string;
}

// Education related types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  description?: string;
  userId?: string;
}

// Skill related types
export interface Skill {
  id: string;
  name: string;
  proficiencyLevel: number;
  category?: string;
  userId?: string;
}

// Certification related types
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
  userId?: string;
}
