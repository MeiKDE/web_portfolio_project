import { DynamicForm } from "@/app/components/common/DynamicForm";
import { educationFormConfig } from "@/app/config/form-configs";
import { Education } from "@/app/components/Educations/educations.types";

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
}

export const EducationForm = ({
  education,
  onDelete,
  onChangeFormData,
  onDone,
}: EducationFormProps) => {
  const config = {
    ...educationFormConfig,
    onDelete,
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
    <DynamicForm
      data={education}
      config={config}
      onFieldChange={handleFieldChange}
    />
  );
};
