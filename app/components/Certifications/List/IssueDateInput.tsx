/** @jsxImportSource react */
import { Certification } from "@/app/components/Certifications/certifications.types";
import { Input } from "@/components/ui/input";
import { getCurrentDate } from "@/app/lib/utils/date-utils";
import React from "react";

interface IssueDateInputProps {
  values: Certification;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: any;
  touched: any;
}

export const IssueDateInput: React.FC<IssueDateInputProps> = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}) => {
  return (
    <div className="flex-1">
      <label className="block text-sm text-gray-600 mb-1">Issue Date*</label>
      <Input
        type="date"
        value={values.issueDate || ""}
        onChange={(e) => handleChange("issueDate", e.target.value)}
        onBlur={() => handleBlur("issueDate")}
        max={getCurrentDate()}
        className={errors.issueDate ? "border-red-500" : ""}
      />
      {errors.issueDate && (
        <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>
      )}
    </div>
  );
};
