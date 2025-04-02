import { Input } from "@/components/ui/input";

interface ProficiencyInputProps {
  values: any;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: any;
  touched: any;
}

export const ProficiencyInput = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}: ProficiencyInputProps) => {
  const proficiencyLevel = values.proficiencyLevel || 1;

  return (
    <Input
      type="number"
      min="1"
      max="10"
      value={proficiencyLevel}
      onChange={(e) => handleChange("proficiencyLevel", e.target.value)}
      onBlur={() => handleBlur("proficiencyLevel")}
      className={`text-sm ${errors.proficiencyLevel ? "border-red-500" : ""}`}
      placeholder="Proficiency Level (1-5) *"
      required
    />
  );
};
