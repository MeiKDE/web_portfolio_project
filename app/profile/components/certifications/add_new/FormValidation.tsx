import { getCurrentDate, formatDateForDatabase } from "@/app/hooks/date-utils";
import { Certification } from "../Interface";
import { useState } from "react";

interface FormValidationProps {
  cancelAddingNew: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

// Initialize form data with custom hook
export const useFormValidation = ({
  cancelAddingNew,
  setIsSubmitting,
}: FormValidationProps) => {
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: "",
    issuer: "",
    issueDate: getCurrentDate(),
    expirationDate: "",
    credentialUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof Certification, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.issuer?.trim()) {
      newErrors.issuer = "Issuer is required";
    }
    if (!formData.issueDate) {
      newErrors.issueDate = "Issue date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name?.trim(),
        issuer: formData.issuer?.trim(),
        issueDate: formatDateForDatabase(formData.issueDate || ""),
        expirationDate: formData.expirationDate
          ? formatDateForDatabase(formData.expirationDate)
          : null,
        credentialUrl: formData.credentialUrl?.trim() || null,
      };

      const response = await fetch("/api/certifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create certification");
      }

      //await mutate();
      cancelAddingNew();
    } catch (error) {
      console.error("Error adding certification:", error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error instanceof Error
            ? error.message
            : "Failed to add certification",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
  };
};
