import { Input } from "@/components/ui/input";
import React from "react";

interface CategoryInputProps {
  values: Record<string, any>;
  handleChange: (field: string, value: string) => void;
  setTouchedFields: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  getInputClassName: (
    field: string,
    error: string,
    className: string
  ) => string;
}

export const CategoryInput = ({
  values,
  handleChange,
  setTouchedFields,
  getInputClassName,
}: CategoryInputProps) => {
  return (
    <Input
      type="text"
      value={values.category}
      onChange={(e) => handleChange("category", e.target.value)}
      onBlur={
        () => setTouchedFields((prev) => ({ ...prev, category: true })) // set the field as touched
      }
      className={getInputClassName("category", "category", "mt-1")} // get the input error class name
      placeholder="e.g., Frontend, Backend, DevOps"
    />
  );
};
