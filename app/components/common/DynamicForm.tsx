import React from "react";
import { FormField } from "@/app/components/ui/FormField";
import { DeleteButton } from "@/app/components/ui/DeleteBtn";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import {
  FormConfig,
  BaseFormData,
  FormFieldConfig,
} from "@/app/types/form.types";

interface DynamicFormProps {
  data: BaseFormData;
  config: FormConfig;
}

export const DynamicForm = ({ data, config }: DynamicFormProps) => {
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
    config.onFormChange(data.id, field, value, validateForm());
    handleChange(field as keyof typeof values, value);
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
            value={data[field.name]}
            label={field.label}
            type={field.type}
            min={field.min}
            max={field.max}
            handleChange={handleFieldChange}
            handleBlur={handleFieldBlur}
            errors={errors}
            touched={touched}
            required={field.required}
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
