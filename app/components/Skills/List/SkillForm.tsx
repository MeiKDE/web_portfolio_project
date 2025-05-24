import { DynamicForm } from "@/app/components/common/DynamicForm";
import { skillFormConfig } from "@/app/config/form-configs";
import { Skill } from "@/app/components/Skills/skills.types";
import { DeleteButton } from "@/app/components/ui/DeleteButton";

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
  isMarkedForDeletion: boolean;
}

export const SkillForm = ({
  skill,
  onDelete,
  onChangeFormData,
  onDone,
  isMarkedForDeletion,
}: SkillFormProps) => {
  const config = {
    ...skillFormConfig,
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
    <div className={`relative ${isMarkedForDeletion ? "opacity-50" : ""}`}>
      <div className="absolute right-2 top-2">
        <DeleteButton
          onClick={() => onDelete(skill)}
          isMarkedForDeletion={isMarkedForDeletion}
        />
      </div>
      <DynamicForm
        data={skill}
        config={config}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
};
