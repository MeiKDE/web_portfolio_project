"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StartDateInputProps {
  startDate?: string;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: Partial<Record<string, string>>;
  touched: Partial<Record<string, boolean>>;
}

export default function StartDateInput({
  startDate = "",
  handleChange,
  handleBlur,
  errors,
  touched,
}: StartDateInputProps) {
  return (
    <div className="mb-4">
      <Label htmlFor="startDate" className="text-sm font-medium">
        Start Date
      </Label>
      <Input
        id="startDate"
        type="date"
        value={startDate}
        onChange={(e) => handleChange("startDate", e.target.value)}
        onBlur={() => handleBlur("startDate")}
        className={`mt-1 ${
          errors.startDate && touched.startDate ? "border-red-500" : ""
        }`}
      />
    </div>
  );
}
