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
      type: "url",
      required: false,
      placeholder: "https://...",
    },
  ],
};
