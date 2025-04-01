import { Input } from "@/components/ui/input";
import React from "react";

interface NameInputProps {
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

export const NameInput = ({
  values,
  handleChange,
  setTouchedFields,
  getInputClassName,
}: NameInputProps) => {
  return (
    <Input
      type="text"
      value={values.name}
      onChange={(e) => handleChange("name", e.target.value)}
      onBlur={() => setTouchedFields((prev) => ({ ...prev, name: true }))} // set the field as touched
      className={getInputClassName("name", "name", "mt-1")} // get the input error class name
      placeholder="e.g., JavaScript, React, Agile"
    />
  );
};
