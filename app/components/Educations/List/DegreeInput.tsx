"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DegreeInputProps {
  degree?: string;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: Partial<Record<string, string>>;
  touched: Partial<Record<string, boolean>>;
}

export default function DegreeInput({
  degree = "",
  handleChange,
  handleBlur,
  errors,
  touched,
}: DegreeInputProps) {
  return (
    <div className="mb-4">
      <Label htmlFor="degree" className="text-sm font-medium">
        Degree
      </Label>
      <Input
        id="degree"
        type="text"
        value={degree}
        onChange={(e) => handleChange("degree", e.target.value)}
        onBlur={() => handleBlur("degree")}
        className={`mt-1 ${
          errors.degree && touched.degree ? "border-red-500" : ""
        }`}
        placeholder="Enter degree"
      />
    </div>
  );
}
