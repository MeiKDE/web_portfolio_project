import { FormConfig } from "@/app/types/form.types";

export const skillFormConfig: FormConfig = {
  fields: [
    {
      name: "name",
      label: "Skill Name",
      type: "text",
      required: true,
      placeholder: "e.g., JavaScript, React, Agile",
    },
    {
      name: "category",
      label: "Category",
      type: "text",
      required: true,
      placeholder: "e.g., Frontend, Backend, DevOps",
    },
    {
      name: "proficiencyLevel",
      label: "Proficiency Level",
      type: "number",
      required: true,
      min: 1,
      max: 5,
      validation: (value) =>
        value >= 1 && value <= 5
          ? null
          : "Proficiency level must be between 1 and 5",
    },
  ],
  onFormChange: (id, field, value, isFormValid) => {},
};

export const certificationFormConfig: FormConfig = {
  fields: [
    {
      name: "name",
      label: "Certification Name",
      type: "text",
      required: true,
      placeholder: "e.g., AWS Solutions Architect, PMP",
    },
    {
      name: "issuer",
      label: "Issuer",
      type: "text",
      required: true,
      placeholder: "e.g., Amazon Web Services, PMI",
    },
    {
      name: "issueDate",
      label: "Issue Date",
      type: "date",
      required: true,
    },
    {
      name: "expirationDate",
      label: "Expiration Date",
      type: "date",
      required: false,
    },
    {
      name: "credentialUrl",
      label: "Credential URL",
      type: "text",
      required: false,
      placeholder: "https://...",
    },
  ],
  onFormChange: (id, field, value, isFormValid) => {},
};

export const educationFormConfig: FormConfig = {
  fields: [
    {
      name: "school",
      label: "School",
      type: "text",
      validation: (value: string) =>
        !value || value.trim().length === 0 ? "School is required" : null,
    },
    {
      name: "degree",
      label: "Degree",
      type: "text",
      validation: (value: string) =>
        !value || value.trim().length === 0 ? "Degree is required" : null,
    },
    {
      name: "fieldOfStudy",
      label: "Field of Study",
      type: "text",
      validation: (value: string) =>
        !value || value.trim().length === 0
          ? "Field of study is required"
          : null,
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      validation: (value: string) => (!value ? "Start date is required" : null),
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      validation: (value: string) => (!value ? "End date is required" : null),
    },
    {
      name: "startYear",
      label: "Start Year",
      type: "number",
      required: true,
      validation: (value: string) => {
        const year = Number(value);
        if (!value) return "Start year is required";
        if (year < 1900 || year > new Date().getFullYear()) {
          return "Please enter a valid year between 1900 and present";
        }
        return null;
      },
    },
    {
      name: "endYear",
      label: "End Year",
      type: "number",
      required: true,
      validation: (value: string) => {
        const year = Number(value);
        if (!value) return "End year is required";
        if (year < 1900 || year > 2100) {
          return "Please enter a valid year between 1900 and 2100";
        }
        return null;
      },
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      validation: () => null, // Optional field
    },
  ],
  onFormChange: (id, field, value, isFormValid) => {},
};

export const profileFormConfig: FormConfig = {
  fields: [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
    },
    {
      name: "title",
      label: "Professional Title",
      type: "text",
      required: true,
      placeholder: "e.g., Senior Software Engineer",
    },
    {
      name: "bio",
      label: "Bio",
      type: "text",
      required: true,
      placeholder: "Write a brief professional summary",
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      required: true,
      placeholder: "e.g., San Francisco, CA",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      required: false,
      placeholder: "Enter your phone number",
      validation: (value) => {
        const phoneRegex = /^\+?[\d\s-()]+$/;
        return phoneRegex.test(value) ? null : "Invalid phone number format";
      },
    },
    {
      name: "profile_email",
      label: "Contact Email",
      type: "text",
      required: true,
      placeholder: "Enter your contact email",
      validation: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : "Invalid email format";
      },
    },
  ],
  onFormChange: (id, field, value, isFormValid) => {},
};

export const experienceFormConfig: FormConfig = {
  fields: [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      required: true,
      placeholder: "e.g., Google, Microsoft",
    },
    {
      name: "position",
      label: "Position",
      type: "text",
      required: true,
      placeholder: "e.g., Software Engineer, Product Manager",
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      required: false,
      placeholder: "e.g., San Francisco, CA",
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      required: true,
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      required: false,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      required: true,
      placeholder: "Describe your responsibilities and achievements",
    },
  ],
  onFormChange: (id, field, value, isFormValid) => {},
};
