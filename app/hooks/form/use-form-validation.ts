import { useState } from "react";
import { useCallback } from "react";

export function useFormValidation<T>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  };

  const validateField = (field: keyof T, value: any) => {
    const error = validationRules[field](value);
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const field = key as keyof T;
      const error = validationRules[field](values[field]);

      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    console.log("resetForm called");
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  };
}

export function useValidationHelpers(
  errors: any,
  touched: any,
  validateForm: () => boolean,
  handleBlur: any,
  values: any
) {
  const getFieldError = useCallback(
    (id: string, field: string) => errors[field as keyof typeof errors],
    [errors]
  );

  const touchField = useCallback(
    (field: string) => handleBlur(field as keyof typeof values),
    [handleBlur, values]
  );

  const hasErrorType = useCallback(
    (id: string, fields: string[]) =>
      fields.some(
        (field) =>
          !!errors[field as keyof typeof errors] &&
          touched[field as keyof typeof touched]
      ),
    [errors, touched]
  );

  const getErrorTypeMessage = useCallback(
    (id: string, fields: string[]) => {
      for (const field of fields) {
        if (
          errors[field as keyof typeof errors] &&
          touched[field as keyof typeof touched]
        ) {
          return errors[field as keyof typeof errors];
        }
      }
      return null;
    },
    [errors, touched]
  );

  const getInputClassName = useCallback(
    (id: string, field: string, baseClass = "") =>
      `${baseClass} ${
        errors[field as keyof typeof errors] &&
        touched[field as keyof typeof touched]
          ? "border-red-500"
          : ""
      }`,
    [errors, touched]
  );

  const validateData = useCallback(() => validateForm(), [validateForm]);

  return {
    getFieldError,
    touchField,
    hasErrorType,
    getErrorTypeMessage,
    getInputClassName,
    validateData,
  };
}
