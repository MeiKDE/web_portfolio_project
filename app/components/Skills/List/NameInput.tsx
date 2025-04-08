import { FormInput } from "@/app/components/ui/FormInput";

interface NameInputProps {
  values: any;
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
    <FormInput
      field="name"
      value={values.name}
      handleChange={handleChange}
      handleBlur={handleBlur}
      errors={errors}
      touched={touched}
      placeholder="Skill Name *"
      className="font-medium mb-2"
      required
    />
  );
};
