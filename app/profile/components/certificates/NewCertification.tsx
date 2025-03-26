"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrentDate, formatDateForDatabase } from "@/app/hooks/date-utils";
import { Certification } from "./Interface";

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
    // Clear error when user types
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

      await mutate(); // Refresh the certifications list
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <Input
          type="text"
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Certification Name*"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Input
          type="text"
          value={formData.issuer || ""}
          onChange={(e) => handleInputChange("issuer", e.target.value)}
          placeholder="Issuing Organization*"
          className={errors.issuer ? "border-red-500" : ""}
        />
        {errors.issuer && (
          <p className="text-red-500 text-sm mt-1">{errors.issuer}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">
            Issue Date*
          </label>
          <Input
            type="date"
            value={formData.issueDate || ""}
            onChange={(e) => handleInputChange("issueDate", e.target.value)}
            max={getCurrentDate()}
            className={errors.issueDate ? "border-red-500" : ""}
          />
          {errors.issueDate && (
            <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">
            Expiration Date
          </label>
          <Input
            type="date"
            value={formData.expirationDate || ""}
            onChange={(e) =>
              handleInputChange("expirationDate", e.target.value)
            }
            min={formData.issueDate}
          />
        </div>
      </div>

      <div>
        <Input
          type="url"
          value={formData.credentialUrl || ""}
          onChange={(e) => handleInputChange("credentialUrl", e.target.value)}
          placeholder="Credential URL (optional)"
        />
      </div>

      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={cancelAddingNew}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Certification"}
        </Button>
      </div>
    </form>
  );
}
