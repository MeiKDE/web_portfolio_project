import { FormInput } from "@/app/components/ui/FormInput";

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
  return (
    <FormInput
      field="proficiencyLevel"
      value={values.proficiencyLevel || 1}
      type="number"
      min={1}
      max={5}
      handleChange={handleChange}
      handleBlur={handleBlur}
      errors={errors}
      touched={touched}
      placeholder="Proficiency Level (1-5) *"
      className="text-sm"
      required
    />
  );
};
