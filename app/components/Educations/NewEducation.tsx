import { useState } from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { Education } from "@/app/components/Educations/educations.types";
import * as React from "react";
import { CancelBtn } from "@/app/components/ui/CancelBtn";
import { SaveBtn } from "@/app/components/ui/SaveBtn";

interface NewEducationProps {
  userId: string;
  createNew: (edu: Education) => void | Promise<void>;
  onCancel?: () => void;
}

export function NewEducation({
  userId,
  createNew,
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
      value.length > 0 ? null : "Institution name is required",
    degree: (value: string) => (value.length > 0 ? null : "Degree is required"),
    fieldOfStudy: (value: string) =>
      value.length > 0 ? null : "Field of study is required",
    startYear: (value: string) =>
      value.length > 0 ? null : "Start year is required",
    endYear: (value: string) => null,
    description: (value: string) => null,
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { values, errors, handleChange, validateForm, resetForm } =
    useFormValidation({
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
    endYear: values.endYear
      ? parseInt(values.endYear)
      : new Date().getFullYear(),
    description: values.description || undefined,
  });

  const createEducationHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    await createNew(getEducationModel());
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
      <form onSubmit={createEducationHandler} className="space-y-4">
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
          <input
            type="text"
            value={values.degree}
            onChange={(e) => handleChange("degree", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "degree"
            )}`}
          />
          {errors.degree && (
            <p className="text-red-500 text-xs mt-1">{errors.degree}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Field of Study*
          </label>
          <input
            type="text"
            value={values.fieldOfStudy}
            onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "fieldOfStudy"
            )}`}
          />
          {errors.fieldOfStudy && (
            <p className="text-red-500 text-xs mt-1">{errors.fieldOfStudy}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Start Year*</label>
          <input
            type="number"
            value={values.startYear}
            onChange={(e) => handleChange("startYear", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "startYear"
            )}`}
          />
          {errors.startYear && (
            <p className="text-red-500 text-xs mt-1">{errors.startYear}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            End Year (Optional)
          </label>
          <input
            type="number"
            value={values.endYear}
            onChange={(e) => handleChange("endYear", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Description (Optional)
          </label>
          <textarea
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <CancelBtn resetForm={handleCancel} />
          <SaveBtn isSubmitting={isSubmitting} component="Education" />
        </div>
      </form>
    </div>
  );
}
