import { NameInput } from "@/app/profile/components/skills/display/child/list/nameInput";
import { CategoryInput } from "@/app/profile/components/skills/display/child/list/categoryInput";
import { ProficiencyInput } from "@/app/profile/components/skills/display/child/list/proficiencyInput";
import { DeleteButton } from "@/app/profile/components/ui/DeleteBtn";
import { Skill } from "@/app/profile/components/skills/Interface";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";

interface SkillFormProps {
  skill: Skill;
  onDeleteClick: (id: string) => void;
  isDeleting: string | null;
}

export const SkillForm = ({
  skill,
  onDeleteClick,
  isDeleting,
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
          values={values}
          handleChange={(field, value) =>
            handleChange(field as keyof typeof values, value)
          }
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
        <CategoryInput
          values={values}
          handleChange={(field, value) =>
            handleChange(field as keyof typeof values, value)
          }
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
        <ProficiencyInput
          values={values}
          handleChange={(field, value) =>
            handleChange(field as keyof typeof values, value)
          }
          handleBlur={(field) => handleBlur(field as keyof typeof values)}
          errors={errors}
          touched={touched}
        />
        {errors.proficiencyLevel && (
          <p className="text-red-500 text-xs mt-1">{errors.proficiencyLevel}</p>
        )}
      </div>
      <div className="flex items-start">
        <DeleteButton
          onDeleteClick={onDeleteClick}
          isDeleting={isDeleting}
          skillId={skill.id}
        />
      </div>
    </div>
  );
};
