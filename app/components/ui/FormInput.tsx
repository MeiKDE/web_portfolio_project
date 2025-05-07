import { Input } from "@/components/ui/input";
import { FormFieldType } from "@/app/types/form.types";

interface FormInputProps {
  field: string;
  value: string | number | null | undefined;
  type?: FormFieldType;
  placeholder?: string;
  min?: number;
  max?: number;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors?: Partial<Record<string, string>>;
  touched?: Partial<Record<string, boolean>>;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormInput = ({
  field,
  value,
  type = "text",
  placeholder,
  min,
  max,
  handleChange,
  handleBlur,
  errors,
  touched,
  className = "",
  required = false,
  disabled = false,
}: FormInputProps) => {
  const hasError = errors?.[field] && touched?.[field];

  const inputValue = value ?? "";

  return (
    <Input
      type={type}
      value={inputValue}
      min={min}
      max={max}
      onChange={(e) => handleChange(field, e.target.value)}
      onBlur={() => handleBlur(field)}
      className={`${className} ${hasError ? "border-red-500" : ""}`}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  );
};
