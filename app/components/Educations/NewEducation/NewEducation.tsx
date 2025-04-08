import { useState } from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { Education } from "@/app/components/Educations/educations.types";
import React from "react";
import { CancelBtn } from "@/app/components/ui/CancelBtn";
import { SaveBtn } from "@/app/components/ui/SaveBtn";

interface NewEducationProps {
  userId: string;
  onSaveNewEducation: (values: Education) => void | Promise<void>;
}

export function NewEducation({
  userId,
  onSaveNewEducation,
}: NewEducationProps) {
  const formValues = {
    name: "",
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
    location: "",
  };

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({
    name: false,
    issuer: false,
    issueDate: false,
    expiryDate: false,
    credentialUrl: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("isSubmitting", isSubmitting);

  const { values, errors, handleChange, validateForm, resetForm } =
    useFormValidation(formValues, {
      name: (value) => (value.length > 0 ? null : "School name is required"),
      school: (value) => (value.length > 0 ? null : "School name is required"),
      degree: (value) => (value.length > 0 ? null : "Degree is required"),
      fieldOfStudy: (value) =>
        value.length > 0 ? null : "Field of study is required",
      startDate: (value) =>
        value.length > 0 ? null : "Start date is required",
      endDate: (value) => null,
      description: (value) => null,
      location: (value) => null,
    });

  const getEducationModel = (values: any): Education => {
    return {
      id: "",
      userId,
      institution: values.school,
      degree: values.degree,
      fieldOfStudy: values.fieldOfStudy,
      startYear: parseInt(values.startDate.split("-")[0]),
      endYear: values.endDate
        ? parseInt(values.endDate.split("-")[0])
        : new Date().getFullYear(),
      description: values.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    onSaveNewEducation(getEducationModel(values));
  };

  const getInputClassName = (field: string) => {
    return errors[field as keyof typeof errors] ? "border-red-500" : "";
  };

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Education</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">School Name*</label>
          <input
            type="text"
            value={values.school}
            onChange={(e) => handleChange("school", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "school"
            )}`}
          />
          {errors.school && (
            <p className="text-red-500 text-xs mt-1">{errors.school}</p>
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
          <label className="text-sm text-muted-foreground">Start Date*</label>
          <input
            type="date"
            value={values.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">End Date</label>
          <input
            type="date"
            value={values.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <CancelBtn resetForm={resetForm} />
        <SaveBtn isSubmitting={isSubmitting} component="Education" />
      </form>
    </div>
  );
}
