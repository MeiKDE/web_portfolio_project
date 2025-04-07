import { DeleteButton } from "@/app/components/ui/DeleteBtn";
import { Education } from "@/app/components/Educations/educations.types";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import React from "react";
import InstitutionInput from "@/app/components/Educations/List/InstitutionInput";
import DegreeInput from "@/app/components/Educations/List/DegreeInput";
import FieldOfStudyInput from "@/app/components/Educations/List/FieldOfStudyInput";
import StartDateInput from "@/app/components/Educations/List/StartDateInput";
import EndDateInput from "@/app/components/Educations/List/EndDateInput";
import DescriptionInput from "@/app/components/Educations/List/DescriptionInput";

interface EducationFormProps {
  education: Education;
  onDeleteClick: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
}

export const EducationForm = ({
  education,
  onDeleteClick,
  onFormChange,
}: EducationFormProps) => {
  const formValues = {
    school: education.school,
    degree: education.degree,
    fieldOfStudy: education.fieldOfStudy,
    startDate: education.startDate,
    endDate: education.endDate,
    description: education.description,
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation(formValues, {
    school: (value) => (value.length > 0 ? null : "School is required"),
    degree: (value) => (value.length > 0 ? null : "Degree is required"),
    fieldOfStudy: (value) =>
      value.length > 0 ? null : "Field of study is required",
    startDate: (value) => (value.length > 0 ? null : "Start date is required"),
    endDate: (value) => (value.length > 0 ? null : "End date is required"),
    description: (value) => null,
  });

  return (
    <div className="flex gap-2">
      <div className="w-full">
        <InstitutionInput
          school={education.school}
          handleChange={(field, value) => {
            onFormChange(education.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.school && (
          <p className="text-red-500 text-xs mt-1">{errors.school}</p>
        )}
        <DegreeInput
          degree={education.degree}
          handleChange={(field, value) => {
            onFormChange(education.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.degree && (
          <p className="text-red-500 text-xs mt-1">{errors.degree}</p>
        )}
        <FieldOfStudyInput
          fieldOfStudy={education.fieldOfStudy}
          handleChange={(field, value) => {
            onFormChange(education.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.fieldOfStudy && (
          <p className="text-red-500 text-xs mt-1">{errors.fieldOfStudy}</p>
        )}
        <StartDateInput
          startDate={education.startDate}
          handleChange={(field, value) => {
            onFormChange(education.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.startDate && (
          <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
        )}
        <EndDateInput
          endDate={education.endDate}
          handleChange={(field, value) => {
            onFormChange(education.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.endDate && (
          <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
        )}
        <DescriptionInput
          description={education.description}
          handleChange={(field, value) => {
            onFormChange(education.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="flex items-start">
        <DeleteButton onDeleteClick={() => onDeleteClick(education.id)} />
      </div>
    </div>
  );
};
