"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FieldOfStudyInputProps {
  fieldOfStudy?: string;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: Partial<Record<string, string>>;
  touched: Partial<Record<string, boolean>>;
}

export default function FieldOfStudyInput({
  fieldOfStudy = "",
  handleChange,
  handleBlur,
  errors,
  touched,
}: FieldOfStudyInputProps) {
  return (
    <div className="mb-4">
      <Label htmlFor="fieldOfStudy" className="text-sm font-medium">
        Field of Study
      </Label>
      <Input
        id="fieldOfStudy"
        type="text"
        value={fieldOfStudy}
        onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
        onBlur={() => handleBlur("fieldOfStudy")}
        className={`mt-1 ${
          errors.fieldOfStudy && touched.fieldOfStudy ? "border-red-500" : ""
        }`}
        placeholder="Enter field of study"
      />
    </div>
  );
}
