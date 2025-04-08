import { useState } from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { Education } from "@/app/components/Educations/educations.types";
import React from "react";
import { CancelBtn } from "@/app/components/ui/CancelBtn";
import { SaveBtn } from "@/app/components/ui/SaveBtn";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormErrorMessage } from "@/app/components/ui/FormErrorMessage";

interface NewEducationProps {
  userId: string;
  onSaveNewEducation: (values: Education) => void | Promise<void>;
}

export function NewEducation({
  userId,
  onSaveNewEducation,
}: NewEducationProps) {
  const formValues = {
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
    location: "",
  };

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({
    school: false,
    degree: false,
    fieldOfStudy: false,
    startDate: false,
    endDate: false,
    description: false,
    location: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation(formValues, {
    school: (value) => (value.length > 0 ? null : "School name is required"),
    degree: (value) => (value.length > 0 ? null : "Degree is required"),
    fieldOfStudy: (value) =>
      value.length > 0 ? null : "Field of study is required",
    startDate: (value) => (value.length > 0 ? null : "Start date is required"),
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
          <FormInput
            field="school"
            value={values.school}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("school")}
            required
          />
          <FormErrorMessage error={errors["school"]} />
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
          <label className="text-sm text-muted-foreground">Start Date*</label>
          <FormInput
            field="startDate"
            type="date"
            value={values.startDate}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            required
          />
          <FormErrorMessage error={errors["startDate"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">End Date</label>
          <FormInput
            field="endDate"
            type="date"
            value={values.endDate}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
          />
          <FormErrorMessage error={errors["endDate"]} />
        </div>

        <CancelBtn resetForm={resetForm} />
        <SaveBtn isSubmitting={isSubmitting} component="Education" />
      </form>
    </div>
  );
}
