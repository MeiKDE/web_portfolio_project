import { useState } from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { Education } from "@/app/components/Educations/educations.types";
import * as React from "react";
import { CancelBtn } from "@/app/components/ui/CancelBtn";
import { SaveBtn } from "@/app/components/ui/SaveBtn";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormErrorMessage } from "@/app/components/ui/FormErrorMessage";

interface NewEducationProps {
  userId: string;
  onSaveNew: (values: Education) => void | Promise<void>;
  onCancel?: () => void;
}

export function NewEducation({
  userId,
  onSaveNew,
  onCancel,
}: NewEducationProps) {
  const initialValues = {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    description: "",
  };

  const validationRules = {
    institution: (value: string) =>
      value.length > 0 ? null : "Institution is required",
    degree: (value: string) => (value.length > 0 ? null : "Degree is required"),
    fieldOfStudy: (value: string) =>
      value.length > 0 ? null : "Field of study is required",
    startYear: (value: string) =>
      value.length > 0 ? null : "Start year is required",
    endYear: (value: string) => null,
    description: (value: string) => null,
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation({
    initialValues,
    validationRules,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const getEducationModel = (): Education => ({
    id: "",
    userId,
    institution: values.institution,
    degree: values.degree,
    fieldOfStudy: values.fieldOfStudy,
    startYear: parseInt(values.startYear),
    endYear: parseInt(values.endYear) || new Date().getFullYear(),
    description: values.description || undefined,
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    await onSaveNew(getEducationModel());
    resetForm();
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  const getInputClassName = (field: string) =>
    errors[field as keyof typeof errors] ? "border-red-500" : "";

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Education</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Institution Name*
          </label>
          <input
            type="text"
            value={values.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "institution"
            )}`}
          />
          {errors.institution && (
            <p className="text-red-500 text-xs mt-1">{errors.institution}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Degree*</label>
          <FormInput
            field="degree"
            value={values.degree}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("degree")}
            required
          />
          <FormErrorMessage error={errors["degree"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Field of Study*
          </label>
          <FormInput
            field="fieldOfStudy"
            value={values.fieldOfStudy}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("fieldOfStudy")}
            required
          />
          <FormErrorMessage error={errors["fieldOfStudy"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Start Year*</label>
          <FormInput
            field="startYear"
            value={values.startYear}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            required
          />
          <FormErrorMessage error={errors["startYear"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">End Year</label>
          <FormInput
            field="endYear"
            value={values.endYear}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
          />
          <FormErrorMessage error={errors["endYear"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Description</label>
          <FormInput
            field="description"
            value={values.description}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("description")}
          />
          <FormErrorMessage error={errors["description"]} />
        </div>

        <div className="flex gap-2">
          <CancelBtn resetForm={handleCancel} />
          <SaveBtn isSubmitting={isSubmitting} component="Education" />
        </div>
      </form>
    </div>
  );
}
