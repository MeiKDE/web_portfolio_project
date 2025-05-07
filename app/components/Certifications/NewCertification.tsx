import { useState } from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { Certification } from "@/app/components/Certifications/certifications.types";
import * as React from "react";
import { CancelBtn } from "@/app/components/ui/CancelBtn";
import { SaveBtn } from "@/app/components/ui/SaveBtn";

interface NewCertificationProps {
  userId: string;
  onSaveNew: (values: Certification) => void | Promise<void>;
  onCancel?: () => void;
}

export function NewCertification({
  userId,
  onSaveNew,
  onCancel,
}: NewCertificationProps) {
  const initialValues = {
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialUrl: "",
  };

  const validationRules = {
    name: (value: string) =>
      value.length > 0 ? null : "Certification name is required",
    issuer: (value: string) => (value.length > 0 ? null : "Issuer is required"),
    issueDate: (value: string) =>
      value.length > 0 ? null : "Issue date is required",
    expiryDate: (value: string) => null,
    credentialUrl: (value: string) => null,
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { values, errors, handleChange, validateForm, resetForm } =
    useFormValidation({
      initialValues,
      validationRules,
      validateOnChange: true,
      validateOnBlur: true,
    });

  const getCertificationModel = (): Certification => ({
    id: "",
    userId,
    name: values.name,
    issuer: values.issuer,
    issueDate: values.issueDate,
    expirationDate: values.expiryDate || undefined,
    credentialUrl: values.credentialUrl || undefined,
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    await onSaveNew(getCertificationModel());
    resetForm();
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  const getInputClassName = (field: string) =>
    errors[field as keyof typeof errors] ? "border-red-500" : "";

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Certification</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Certification Name*
          </label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName("name")}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Issuer*</label>
          <input
            type="text"
            value={values.issuer}
            onChange={(e) => handleChange("issuer", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "issuer"
            )}`}
          />
          {errors.issuer && (
            <p className="text-red-500 text-xs mt-1">{errors.issuer}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Issue Date*</label>
          <input
            type="date"
            value={values.issueDate}
            onChange={(e) => handleChange("issueDate", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "issueDate"
            )}`}
          />
          {errors.issueDate && (
            <p className="text-red-500 text-xs mt-1">{errors.issueDate}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Expiry Date (Optional)
          </label>
          <input
            type="date"
            value={values.expiryDate}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Credential URL (Optional)
          </label>
          <input
            type="url"
            value={values.credentialUrl}
            onChange={(e) => handleChange("credentialUrl", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-2">
          <CancelBtn resetForm={handleCancel} />
          <SaveBtn isSubmitting={isSubmitting} component="Certification" />
        </div>
      </form>
    </div>
  );
}
