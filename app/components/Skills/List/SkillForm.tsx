import { DynamicForm } from "@/app/components/common/DynamicForm";
import { skillFormConfig } from "@/app/config/form-configs";
import { Skill } from "@/app/components/Skills/skills.types";

interface SkillFormProps {
  skill: Skill;
  onDelete: (skill: Skill) => void;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  onDone: () => void;
}

export const SkillForm = ({
  skill,
  onDelete,
  onChangeFormData,
  onDone,
}: SkillFormProps) => {
  const config = {
    ...skillFormConfig,
    onDelete,
    onFormChange: onChangeFormData,
    disabled: !onDone,
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
