import { DeleteButton } from "@/app/components/ui/DeleteBtn";
import { Skill } from "@/app/components/Skills/skills.types";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import React from "react";
import { FormField } from "@/app/components/ui/FormField";

interface SkillFormProps {
  skill: Skill;
  onDeleteClick: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
}

export const SkillForm = ({
  skill,
  onDeleteClick,
  onFormChange,
}: SkillFormProps) => {
  const formValues = {
    name: skill.name,
    category: skill.category,
    proficiencyLevel: skill.proficiencyLevel,
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
    name: (value) => (value.length > 0 ? null : "Name is required"),
    category: (value) => (value.length > 0 ? null : "Category is required"),
    proficiencyLevel: (value) =>
      value >= 1 && value <= 5
        ? null
        : "Proficiency level must be between 1 and 5",
  });

  const handleFieldChange = (field: string, value: string) => {
    onFormChange(skill.id, field, value, validateForm());
    handleChange(field as keyof typeof values, value);
  };

  const handleFieldBlur = (field: string) => {
    handleBlur(field as keyof typeof values);
  };

  return (
    <div className="flex gap-2">
      <div className="w-full">
        <FormField
          field="name"
          value={skill.name}
          label="Skill Name"
          handleChange={handleFieldChange}
          handleBlur={handleFieldBlur}
          errors={errors}
          touched={touched}
          required
        />

        <FormField
          field="category"
          value={skill.category}
          label="Category"
          handleChange={handleFieldChange}
          handleBlur={handleFieldBlur}
          errors={errors}
          touched={touched}
          required
        />

        <FormField
          field="proficiencyLevel"
          value={skill.proficiencyLevel}
          type="number"
          min={1}
          max={5}
          label="Proficiency Level"
          handleChange={handleFieldChange}
          handleBlur={handleFieldBlur}
          errors={errors}
          touched={touched}
          required
        />
      </div>
      <DeleteButton onDeleteClick={() => onDeleteClick(skill.id)} />
    </div>
  );
};
