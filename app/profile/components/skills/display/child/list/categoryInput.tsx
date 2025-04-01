import { Input } from "@/components/ui/input";

interface CategoryInputProps {
  values: any;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: any;
  touched: any;
}

export const CategoryInput = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}: CategoryInputProps) => {
  return (
    <Input
      type="text"
      value={values.category}
      onChange={(e) => handleChange("category", e.target.value)}
      onBlur={() => handleBlur("category")}
      className={`text-sm mb-2 ${errors.category ? "border-red-500" : ""}`}
      placeholder="Category *"
      required
    />
  );
};
