import { Input } from "@/components/ui/input";
import React from "react";

interface ProficiencyInputProps {
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

export const ProficiencyInput = ({
  values,
  handleChange,
  setTouchedFields,
  getInputClassName,
}: ProficiencyInputProps) => {
  return (
    <Input
      type="number"
      min="1"
      max="5"
      onChange={(e) => handleChange("proficiencyLevel", e.target.value)}
      value={values.proficiencyLevel}
      onBlur={
        () =>
          setTouchedFields((prev) => ({
            ...prev,
            proficiencyLevel: true,
          })) // set the field as touched
      }
      className={getInputClassName(
        "proficiencyLevel",
        "proficiencyLevel",
        "mt-1"
      )} // get the input error class name
    />
  );
};
