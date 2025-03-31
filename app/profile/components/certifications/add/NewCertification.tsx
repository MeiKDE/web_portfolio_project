"use client";
import { CertificateNameInput } from "./child/new-certification/CertificateNameInput";
import { IssuingOrganizationInput } from "./child/new-certification/IssuingOrganizationInput";
import { IssueDateInput } from "./child/new-certification/IssueDateInput";
import { ExpirationDateInput } from "./child/new-certification/ExpirationDateInput";
import { CredentialUrlInput } from "./child/new-certification/CredentialUrlInput";
import { FormValidation } from "./child/new-certification/FormValidation";
import { CancelSave } from "./child/new-certification/CancelSave";
import { Certification } from "../Interface";
import { useState } from "react";
import { SaveNewCertification } from "../SaveNewCertifications";
interface NewCertificationProps {
  userId: string;
  onSave: (certification: Certification) => Promise<void>;
}

export function NewCertification({ userId, onSave }: NewCertificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<Record<string, any>>({
    name: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialUrl: "",
  });

  const resetForm = () => {
    setValues({
      name: "",
      issuer: "",
      issueDate: "",
      expirationDate: "",
      credentialUrl: "",
    });
    setTouchedFields({}); // Reset touched fields
    setFormErrors({}); // Reset form errors
  };

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value })); // update prev values with new value
  };

  // Get the input error class name
  const getInputClassName = (id: string, field: string, baseClass: string) => {
    // Check if the field has been touched and if it has an error
    const hasError = touchedFields[field] && formErrors[field];
    return `${baseClass} ${hasError ? "border-red-500" : ""}`;
  };

  // Submit the form
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate raw input values
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate name
    // if name is empty, set the error and isValid to false
    if (!values.name || values.name.trim() === "") {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate issuer
    // if issuer is empty, set the error and isValid to false
    if (!values.issuer || values.issuer.trim() === "") {
      errors.issuer = "Issuer is required";
      isValid = false;
    }

    // Validate issueDate
    // if issueDate is empty, set the error and isValid to false
    if (!values.issueDate || values.issueDate.trim() === "") {
      errors.issueDate = "Issue date is required";
      isValid = false;
    }

    // Validate expirationDate
    // if expirationDate is empty, set the error and isValid to false
    if (!values.expirationDate || values.expirationDate.trim() === "") {
      errors.expirationDate = "Expiration date is required";
      isValid = false;
    }

    // Validate credentialUrl
    // if credentialUrl is empty, set the error and isValid to false
    if (!values.credentialUrl || values.credentialUrl.trim() === "") {
      errors.credentialUrl = "Credential URL is required";
      isValid = false;
    }

    // if the form is not valid, set the form errors
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    // set the form as submitting
    setIsSubmitting(true);

    try {
      const postData = {
        name: values.name.trim(),
        issuer: values.issuer.trim(),
        issueDate: values.issueDate.trim(),
        expirationDate: values.expirationDate.trim(),
        credentialUrl: values.credentialUrl.trim(),
      };
      await SaveNewCertification(postData);
      resetForm();
      await onSave(postData); // Call this to hide the form and refresh data
    } catch (error) {
      console.error("Error saving certification:", error);
    } finally {
      setIsSubmitting(false); //reset the isSubmitting to false
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      <CertificateNameInput
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      <IssuingOrganizationInput
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      <div className="flex gap-4">
        <IssueDateInput
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />

        <ExpirationDateInput
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      </div>

      <CredentialUrlInput
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      {/* Create a certification object for validation */}
      <FormValidation
        certification={{
          id: "",
          userId,
          name: values.name || "",
          issuer: values.issuer || "",
          issueDate: values.issueDate || "",
          expirationDate: values.expirationDate || "",
          credentialUrl: values.credentialUrl || "",
        }}
        touchedFields={touchedFields}
      />

      <CancelSave isSubmitting={isSubmitting} resetForm={resetForm} />
    </form>
  );
}
