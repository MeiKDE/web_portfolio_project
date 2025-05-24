import { DynamicForm } from "@/app/components/common/DynamicForm";
import { skillFormConfig } from "@/app/config/form-configs";
import { Skill } from "@/app/components/Skills/skills.types";

interface SkillFormProps {
  skill: Skill;
  onDelete: (id: string) => void;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  isEditing?: boolean;
}

export const SkillForm = ({
  skill,
  onDelete,
  onChangeFormData,
  isEditing,
}: SkillFormProps) => {
  const config = {
    ...skillFormConfig,
    onDelete: onDelete,
    onFormChange: onChangeFormData,
  };

  const handleFieldChange = (
    field: string,
    value: string,
    isValid: boolean
  ) => {
    onChangeFormData(skill.id, field, value, isValid);
  };

  return (
    <DynamicForm
      data={skill}
      config={config}
      onFieldChange={handleFieldChange}
    />
  );
};
