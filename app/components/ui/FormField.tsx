import { FormInput } from "./FormInput";
import { FormErrorMessage } from "./FormErrorMessage";

interface FormFieldProps extends React.ComponentProps<typeof FormInput> {
  label?: string;
  showError?: boolean;
}

export const FormField = ({
  label,
  showError = true,
  ...props
}: FormFieldProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="text-sm text-muted-foreground mb-1 block">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <FormInput {...props} />
      {showError && <FormErrorMessage error={props.errors?.[props.field]} />}
    </div>
  );
};
