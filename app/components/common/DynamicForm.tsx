import React from "react";
import { FormField } from "@/app/components/ui/FormField";
import { DeleteButton } from "@/app/components/ui/DeleteBtn";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import {
  FormConfig,
  BaseFormData,
  FormFieldConfig,
} from "@/app/types/form.types";

interface DynamicFormProps<T extends BaseFormData> {
  data: T;
  config: FormConfig;
  formData: T[];
  setFormData: React.Dispatch<React.SetStateAction<T[]>>;
}

export const DynamicForm = <T extends BaseFormData>({
  data,
  config,
  formData,
  setFormData,
}: DynamicFormProps<T>) => {
  const formValues = config.fields.reduce((acc, field) => {
    acc[field.name] = data[field.name];
    return acc;
  }, {} as Record<string, any>);

  const validations = config.fields.reduce((acc, field) => {
    acc[field.name] =
      field.validation ||
      ((value) =>
        field.required && (!value || value.length === 0)
          ? `${field.label} is required`
          : null);
    return acc;
  }, {} as Record<string, (value: any) => string | null>);

  const { values, errors, touched, handleChange, handleBlur, validateForm } =
    useFormValidation(formValues, validations);

  const handleFieldChange = (field: string, value: string) => {
    const newValue = value;

    // Update the form data in parent component
    setFormData((prevData) =>
      prevData.map((item) =>
        item.id === data.id ? ({ ...item, [field]: newValue } as T) : item
      )
    );

    config.onFormChange(data.id, field, newValue, validateForm());
    handleChange(field as keyof typeof values, newValue);
  };

  const handleFieldBlur = (field: string) => {
    handleBlur(field as keyof typeof values);
  };

  return (
    <div className="flex gap-2">
      <div className="w-full">
        {config.fields.map((field) => (
          <FormField
            key={field.name}
            field={field.name}
            value={values[field.name] || ""}
            label={field.label}
            type={field.type}
            min={field.min}
            max={field.max}
            handleChange={(field: string, value: string) =>
              handleFieldChange(field, value)
            }
            handleBlur={handleFieldBlur}
            errors={errors}
            touched={touched}
            required={field.required}
            disabled={config.disabled}
          />
        ))}
      </div>
      {config.onDelete && (
        <div className="flex items-start">
          <DeleteButton onDeleteClick={() => config.onDelete!(data.id)} />
        </div>
      )}
    </div>
  );
};
