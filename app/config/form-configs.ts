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
        value.length > 0 ? null : "School is required",
    },
    {
      name: "degree",
      label: "Degree",
      type: "text",
      validation: (value: string) =>
        value.length > 0 ? null : "Degree is required",
    },
    {
      name: "fieldOfStudy",
      label: "Field of Study",
      type: "text",
      validation: (value: string) =>
        value.length > 0 ? null : "Field of study is required",
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      validation: (value: string) =>
        value.length > 0 ? null : "Start date is required",
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      validation: (value: string) =>
        value.length > 0 ? null : "End date is required",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      validation: (value: string) => null,
    },
  ],
  onFormChange: (id, field, value, isFormValid) => {},
};
