"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InstitutionInputProps {
  school?: string;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: Partial<Record<string, string>>;
  touched: Partial<Record<string, boolean>>;
}

export default function InstitutionInput({
  school = "",
  handleChange,
  handleBlur,
  errors,
  touched,
}: InstitutionInputProps) {
  return (
    <div className="mb-4">
      <Label htmlFor="school" className="text-sm font-medium">
        School/Institution
      </Label>
      <Input
        id="school"
        type="text"
        value={school}
        onChange={(e) => handleChange("school", e.target.value)}
        onBlur={() => handleBlur("school")}
        className={`mt-1 ${
          errors.school && touched.school ? "border-red-500" : ""
        }`}
        placeholder="Enter school or institution"
      />
    </div>
  );
}
