import { Input } from "@/components/ui/input";

interface NameInputProps {
  values: Record<string, any>;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: any;
  touched: any;
}

export const NameInput = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}: NameInputProps) => {
  return (
    <Input
      type="text"
      value={values.name}
      onChange={(e) => handleChange("name", e.target.value)}
      onBlur={() => handleBlur("name")}
      className={`text-sm mb-2 ${errors.name ? "border-red-500" : ""}`}
      placeholder="Certification Name *"
      required
    />
  );
};
