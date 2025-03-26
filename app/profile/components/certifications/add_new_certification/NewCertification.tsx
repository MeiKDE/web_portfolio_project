"use client";
import { CertificateNameInput } from "./CertificateNameInput";
import { IssuingOrganizationInput } from "./IssuingOrganizationInput";
import { IssueDateInput } from "./IssueDateInput";
import { ExpirationDateInput } from "./ExpirationDateInput";
import { CredentialUrlInput } from "./CredentialUrlInput";
import { useFormValidation } from "./FormValidation";
import { CancelAddButtons } from "./CancelAddButtons";
interface NewCertificationProps {
  mutate: () => void;
  cancelAddingNew: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export function NewCertification({
  mutate,
  cancelAddingNew,
  isSubmitting,
  setIsSubmitting,
}: NewCertificationProps) {
  const { formData, errors, handleInputChange, handleSubmit } =
    useFormValidation({
      mutate,
      cancelAddingNew,
      setIsSubmitting,
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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

      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

      <CancelAddButtons
        cancelAddingNew={cancelAddingNew}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
