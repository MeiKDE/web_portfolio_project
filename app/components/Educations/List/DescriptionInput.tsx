"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionInputProps {
  description?: string | null;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: Partial<Record<string, string>>;
  touched: Partial<Record<string, boolean>>;
}

export default function DescriptionInput({
  description = "",
  handleChange,
  handleBlur,
  errors,
  touched,
}: DescriptionInputProps) {
  return (
    <div className="mb-4">
      <Label htmlFor="description" className="text-sm font-medium">
        Description
      </Label>
      <Textarea
        id="description"
        value={description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        onBlur={() => handleBlur("description")}
        className={`mt-1 ${
          errors.description && touched.description ? "border-red-500" : ""
        }`}
        placeholder="Enter description"
        rows={4}
      />
    </div>
  );
}
