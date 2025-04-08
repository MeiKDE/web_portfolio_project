import { Input } from "@/components/ui/input";

interface FormInputProps {
  field: string;
  value: string | number;
  type?: "text" | "number" | "date";
  placeholder?: string;
  min?: number;
  max?: number;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  className?: string;
  required?: boolean;
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
}: FormInputProps) => {
  const hasError = errors?.[field] && touched?.[field];

  return (
    <Input
      type={type}
      value={value}
      min={min}
      max={max}
      onChange={(e) => handleChange(field, e.target.value)}
      onBlur={() => handleBlur(field)}
      className={`${className} ${hasError ? "border-red-500" : ""}`}
      placeholder={placeholder}
      required={required}
    />
  );
};
