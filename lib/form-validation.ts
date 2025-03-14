import { useState } from "react";
import { z } from "zod";

export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: z.ZodIssue[] | null;
  }>({});

  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: Record<string, boolean>;
  }>({});

  // Validate data against schema
  const validateData = (data: T, id: string): boolean => {
    try {
      schema.parse(data);
      setValidationErrors((prev) => ({ ...prev, [id]: null }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors((prev) => ({ ...prev, [id]: error.issues }));
        return false;
      }
      return false;
    }
  };

  // Mark a field as touched
  const touchField = (id: string, field: string): void => {
    setTouchedFields((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: true },
    }));
  };

  // Check if a field has been touched
  const isFieldTouched = (id: string, field: string): boolean => {
    return touchedFields[id]?.[field] || false;
  };

  // Get error message for a specific field
  const getFieldError = (id: string, field: string): string | null => {
    if (!validationErrors[id]) return null;

    const issues = validationErrors[id];
    if (!issues) return null;

    const issue = issues.find((i) => i.path.includes(field));
    return issue ? issue.message : null;
  };

  // Check if a field has a specific type of error (e.g., date range error)
  const hasErrorType = (id: string, fields: string[]): boolean => {
    if (!validationErrors[id] || !Array.isArray(validationErrors[id]))
      return false;

    const issues = validationErrors[id] as z.ZodIssue[];
    return issues.some((issue) =>
      fields.every((field) => issue.path.includes(field))
    );
  };

  // Get error message for a specific error type
  const getErrorTypeMessage = (id: string, fields: string[]): string | null => {
    if (!validationErrors[id] || !Array.isArray(validationErrors[id]))
      return null;

    const issues = validationErrors[id] as z.ZodIssue[];
    const issue = issues.find((issue) =>
      fields.every((field) => issue.path.includes(field))
    );

    return issue ? issue.message : null;
  };

  // Clear all validation errors
  const clearValidationErrors = (): void => {
    setValidationErrors({});
  };

  // Clear all touched fields
  const clearTouchedFields = (): void => {
    setTouchedFields({});
  };

  // Get CSS class based on validation state
  const getInputClassName = (
    id: string,
    field: string,
    baseClassName: string = ""
  ): string => {
    if (!isFieldTouched(id, field)) return baseClassName;

    const error = getFieldError(id, field);
    if (error)
      return `${baseClassName} border-red-500 focus-visible:ring-red-500`;
    return `${baseClassName} border-green-500 focus-visible:ring-green-500`;
  };

  return {
    validationErrors,
    validateData,
    touchField,
    isFieldTouched,
    getFieldError,
    hasErrorType,
    getErrorTypeMessage,
    clearValidationErrors,
    clearTouchedFields,
    getInputClassName,
  };
}
