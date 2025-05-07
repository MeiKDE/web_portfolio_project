export type FormFieldConfig = {
  name: string;
  label: string;
  type?: "text" | "number" | "date";
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  validation?: (value: any) => string | null;
};

export type FormConfig = {
  fields: FormFieldConfig[];
  onDelete?: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  disabled?: boolean;
};

export interface BaseFormData {
  id: string;
  [key: string]: any;
}
