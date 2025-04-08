import { DeleteButton } from "@/app/components/ui/DeleteBtn";
import { Certification } from "@/app/components/Certifications/certifications.types";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import React from "react";
import { FormField } from "@/app/components/ui/FormField";

interface CertificationFormProps {
  certification: Certification;
  onDeleteClick: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
}

export const CertificationForm = ({
  certification,
  onDeleteClick,
  onFormChange,
}: CertificationFormProps) => {
  const formValues = {
    name: certification.name,
    issuer: certification.issuer,
    issueDate: certification.issueDate,
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation(formValues, {
    name: (value) => (value.length > 0 ? null : "Name is required"),
    issuer: (value) => (value.length > 0 ? null : "Issuer is required"),
    issueDate: (value) => (value.length > 0 ? null : "Issue date is required"),
  });

  const handleFieldChange = (field: string, value: string) => {
    onFormChange(certification.id, field, value, validateForm());
    handleChange(field as keyof typeof values, value);
  };

  const handleFieldBlur = (field: string) => {
    handleBlur(field as keyof typeof values);
  };

  return (
    <div className="flex gap-2">
      <div className="w-full">
        <FormField
          field="name"
          value={certification.name}
          label="Name"
          handleChange={handleFieldChange}
          handleBlur={handleFieldBlur}
          errors={errors}
          touched={touched}
          required
        />

        <FormField
          field="issuer"
          value={certification.issuer}
          label="Issuer"
          handleChange={handleFieldChange}
          handleBlur={handleFieldBlur}
          errors={errors}
          touched={touched}
          required
        />

        <FormField
          field="issueDate"
          value={certification.issueDate}
          label="Issue Date"
          handleChange={handleFieldChange}
          handleBlur={handleFieldBlur}
          errors={errors}
          touched={touched}
          required
        />
      </div>
      <div className="flex items-start">
        <DeleteButton onDeleteClick={() => onDeleteClick(certification.id)} />
      </div>
    </div>
  );
};
