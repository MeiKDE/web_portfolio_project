import { Input } from "@/components/ui/input";
import { Certification } from "../Interface";
import React from "react";

interface CertificateNameProps {
  formData: Partial<Certification>;
  errors: Record<string, string>;
  handleInputChange: (field: keyof Certification, value: string) => void;
}

export function CertificateNameInput({
  formData,
  errors,
  handleInputChange,
}: CertificateNameProps) {
  return (
    <div>
      <Input
        type="text"
        value={formData.name || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange("name", e.target.value)
        }
        placeholder="Certification Name*"
        className={errors.name ? "border-red-500" : ""}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
      )}
    </div>
  );
}
