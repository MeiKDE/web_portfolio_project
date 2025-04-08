import { NameInput } from "@/app/components/Certifications/List/NameInput";
import { IssuerInput } from "@/app/components/Certifications/List/IssuerInput";
import { IssueDateInput } from "@/app/components/Certifications/List/IssueDateInput";
import { DeleteButton } from "@/app/components/ui/DeleteBtn";
import { Certification } from "@/app/components/Certifications/certifications.types";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import React from "react";
import { FormErrorMessage } from "@/app/components/ui/FormErrorMessage";

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

  return (
    <div className="flex gap-2">
      <div className="w-full">
        <NameInput
          values={certification}
          handleChange={(field, value) => {
            onFormChange(certification.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        <FormErrorMessage error={errors.name} />
        <IssuerInput
          values={certification}
          handleChange={(field, value) => {
            onFormChange(certification.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        <FormErrorMessage error={errors.issuer} />
        <IssueDateInput
          values={certification}
          handleChange={(field, value) => {
            onFormChange(certification.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        <FormErrorMessage error={errors.issueDate} />
      </div>
      <div className="flex items-start">
        <DeleteButton onDeleteClick={() => onDeleteClick(certification.id)} />
      </div>
    </div>
  );
};
