import { DynamicForm } from "@/app/components/common/DynamicForm";
import { skillFormConfig } from "@/app/config/form-configs";
import { Skill } from "@/app/components/Skills/skills.types";

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
  const config = {
    ...skillFormConfig,
    onDelete: onDeleteClick,
    onFormChange,
  };

  return <DynamicForm data={skill} config={config} />;
};
