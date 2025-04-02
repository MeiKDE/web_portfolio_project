import { NameInput } from "@/app/components/Skills/List/NameInput";
import { CategoryInput } from "@/app/components/Skills/List/CategoryInput";
import { ProficiencyInput } from "@/app/components/Skills/List/ProficiencyInput";
import { DeleteButton } from "@/app/components/ui/DeleteBtn";
import { Skill } from "@/app/components/Skills/skills.types";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import React from "react";

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

  return (
    <div className="flex gap-2">
      <div className="w-full">
        <NameInput
          values={skill}
          handleChange={(field, value) => {
            onFormChange(skill.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
        <CategoryInput
          values={skill}
          handleChange={(field, value) => {
            onFormChange(skill.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
        <ProficiencyInput
          values={skill}
          handleChange={(field, value) => {
            onFormChange(skill.id, field, value, validateForm());
            handleChange(field as keyof typeof values, value);
          }}
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.proficiencyLevel && (
          <p className="text-red-500 text-xs mt-1">{errors.proficiencyLevel}</p>
        )}
      </div>
      <div className="flex items-start">
        <DeleteButton onDeleteClick={() => onDeleteClick(skill.id)} />
      </div>
    </div>
  );
};
