"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EndDateInputProps {
  endDate?: string;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: Partial<Record<string, string>>;
  touched: Partial<Record<string, boolean>>;
}

export default function EndDateInput({
  endDate = "",
  handleChange,
  handleBlur,
  errors,
  touched,
}: EndDateInputProps) {
  return (
    <div className="mb-4">
      <Label htmlFor="endDate" className="text-sm font-medium">
        End Date
      </Label>
      <Input
        id="endDate"
        type="date"
        value={endDate}
        onChange={(e) => handleChange("endDate", e.target.value)}
        onBlur={() => handleBlur("endDate")}
        className={`mt-1 ${
          errors.endDate && touched.endDate ? "border-red-500" : ""
        }`}
      />
    </div>
  );
}
