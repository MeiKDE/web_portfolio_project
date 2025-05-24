import { DynamicForm } from "@/app/components/common/DynamicForm";
import { experienceFormConfig } from "@/app/config/form-configs";
import { Experience } from "@/app/components/Experiences/experiences.types";

interface ExperienceFormProps {
  experience: Experience;
  onDelete: (exp: Experience) => void;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  onDone: () => void;
}

export const ExperienceForm = ({
  experience,
  onDelete,
  onChangeFormData,
  onDone,
}: ExperienceFormProps) => {
  const config = {
    ...experienceFormConfig,
    onDelete,
    onFormChange: onChangeFormData,
    disabled: !onDone,
  };

  const handleFieldChange = (
    field: string,
    value: string,
    isValid: boolean
  ) => {
    onChangeFormData(experience.id, field, value, isValid);
  };

  return (
    <DynamicForm
      data={experience}
      config={config}
      onFieldChange={handleFieldChange}
    />
  );
};
