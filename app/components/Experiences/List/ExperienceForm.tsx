import { DynamicForm } from "@/app/components/common/DynamicForm";
import { experienceFormConfig } from "@/app/config/form-configs";
import { Experience } from "@/app/components/Experiences/experiences.types";
import { DeleteButton } from "@/app/components/ui/DeleteButton";

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
  isMarkedForDeletion: boolean;
}

export function ExperienceForm({
  experience,
  onDelete,
  onChangeFormData,
  isMarkedForDeletion,
  onDone,
}: ExperienceFormProps) {
  const config = {
    ...experienceFormConfig,
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
    <div className={`relative ${isMarkedForDeletion ? "opacity-50" : ""}`}>
      <div className="absolute right-2 top-2">
        <DeleteButton
          onClick={() => onDelete(experience)}
          isMarkedForDeletion={isMarkedForDeletion}
        />
      </div>
      <DynamicForm
        data={experience}
        config={config}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}
