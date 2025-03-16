import { z } from "zod";

// Experience validation schema
export const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).nullable().optional(),
  description: z.string().optional(),
  isCurrentPosition: z.boolean().optional().default(false),
});

// Certification validation schema
export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expirationDate: z.string().nullable().optional(),
  credentialUrl: z.string().url("Invalid URL format").nullable().optional(),
});

// Add other validation schemas as needed

// Education validation schema
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of Study is required"),
  startYear: z.number().min(1900, "Start Year must be greater than 1900"),
  endYear: z
    .number()
    .min(1900, "End Year must be greater than 1900")
    .optional(),
  description: z.string().optional(),
});

// Skill validation schema
export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  proficiencyLevel: z.number().min(1).max(10).optional(),
});

// Project validation schema
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()).optional(),
  category: z.string().optional(),
});

// SocialLink validation schema
export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid URL"),
});

// AISuggestion validation schema
export const aiSuggestionSchema = z.object({
  suggestion: z.string().min(1, "Suggestion is required"),
  createdAt: z.string().or(z.date()),
});

// User validation schema
export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Phone number regex pattern for international format
// Allows formats like: +1 (123) 456-7890, +44 7911 123456, 123-456-7890
const phoneRegex =
  /^(\+\d{1,3}( )?)?((\(\d{1,3}\))|\d{1,3})[- .]?\d{3,4}[- .]?\d{4}$/;

// User profile validation schema (for profile updates)
export const userProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  image: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  phone: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        // If empty or null, it's valid (since phone is optional)
        if (!val) return true;
        // Otherwise, check against regex
        return phoneRegex.test(val);
      },
      {
        message:
          "Invalid phone number format. Please use a standard format like +1 (123) 456-7890",
      }
    ),
  bio: z.string().optional().nullable(),
  isAvailable: z.boolean().optional().nullable(),
});

export type UserProfileData = z.infer<typeof userProfileSchema>;
