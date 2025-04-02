/** @jsxImportSource react */
import { Certification } from "@/app/profile/components/Certifications/certifications.types";
import { Input } from "@/components/ui/input";
import { getCurrentDate } from "@/app/lib/utils/date-utils";
import React from "react";

interface IssueDateInputProps {
  formData: Partial<Certification>;
  errors: Record<string, string>;
  handleInputChange: (field: keyof Certification, value: string) => void;
}

export const DateInputs: React.FC<IssueDateInputProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  return (
    <div className="flex-1">
      <label className="block text-sm text-gray-600 mb-1">Issue Date*</label>
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
  );
};
