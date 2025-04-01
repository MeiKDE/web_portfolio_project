import { Certification } from "@/app/profile/components/certifications/Interface";
import { Input } from "@/components/ui/input";
import React from "react";

interface CredentialUrlInputProps {
  formData: Partial<Certification>;
  errors: Record<string, string>;
  handleInputChange: (field: keyof Certification, value: string) => void;
}
export function UrlInput({
  formData,
  errors,
  handleInputChange,
}: CredentialUrlInputProps) {
  return (
    <div>
      <Input
        type="url"
        value={formData.credentialUrl || ""}
        onChange={(e) => handleInputChange("credentialUrl", e.target.value)}
        placeholder="Credential URL (optional)"
      />
    </div>
  );
}
