import React from "react";
import { FormField } from "@/app/components/ui/FormField";
import { DeleteButton } from "@/app/components/ui/DeleteButton";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import {
  FormConfig,
  BaseFormData,
  FormFieldConfig,
} from "@/app/types/form.types";

interface DynamicFormProps<T extends BaseFormData> {
  data: T;
  config: FormConfig;
  onFieldChange: (field: string, value: string, isValid: boolean) => void;
  onFieldBlur?: (field: string) => void;
}

export const DynamicForm = <T extends BaseFormData>({
  data,
  config,
  onFieldChange,
  onFieldBlur,
}: DynamicFormProps<T>) => {
  const { values, errors, touched, handleChange, handleBlur, validateForm } =
    useFormValidation<Record<string, any>>({
      initialValues: config.fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: data[field.name],
        }),
        {} as Record<string, any>
      ),
      validationRules: config.fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.validation || createDefaultValidation(field),
        }),
        {}
      ),
    });

  const handleFieldChange = (field: string, value: string) => {
    const newValue = value;

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
          <DeleteButton
            onClick={() => config.onDelete!(data)}
            isMarkedForDeletion={false}
          />
        </div>
      )}
    </div>
  );
};

// Helper function to create default validation
const createDefaultValidation = (field: FormFieldConfig) => (value: any) =>
  field.required && (!value || value.length === 0)
    ? `${field.label} is required`
    : null;
