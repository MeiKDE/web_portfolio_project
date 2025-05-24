import { DynamicForm } from "@/app/components/common/DynamicForm";
import { educationFormConfig } from "@/app/config/form-configs";
import { Education } from "@/app/components/Educations/educations.types";
import { DeleteButton } from "@/app/components/ui/DeleteButton";

interface EducationFormProps {
  education: Education;
  onDelete: (edu: Education) => void;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  onDone: () => void;
  isMarkedForDeletion: boolean;
}

export function EducationForm({
  education,
  onDelete,
  onChangeFormData,
  isMarkedForDeletion,
  onDone,
}: EducationFormProps) {
  const config = {
    ...educationFormConfig,
    onFormChange: onChangeFormData,
    disabled: !onDone,
  };

  const handleFieldChange = (
    field: string,
    value: string,
    isValid: boolean
  ) => {
    onChangeFormData(education.id, field, value, isValid);
  };

  return (
    <div className={`relative ${isMarkedForDeletion ? "opacity-50" : ""}`}>
      <div className="absolute right-2 top-2">
        <DeleteButton
          onClick={() => onDelete(education)}
          isMarkedForDeletion={isMarkedForDeletion}
        />
      </div>
      <DynamicForm
        data={education}
        config={config}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}
