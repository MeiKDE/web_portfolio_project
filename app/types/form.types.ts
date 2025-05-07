export type ValidationFunction = (value: any, allValues?: any) => string | null;

export type FormFieldType = "text" | "number" | "date" | "email" | "tel";

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: FormFieldType;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  validation?: ValidationFunction;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

export interface FormConfig {
  fields: FormFieldConfig[];
  onDelete?: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  disabled?: boolean;
  showLabels?: boolean;
  showErrors?: boolean;
  className?: string;
}

export interface BaseFormData {
  id: string;
  [key: string]: any;
}
