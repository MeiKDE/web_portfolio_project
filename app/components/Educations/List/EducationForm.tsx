import { DynamicForm } from "@/app/components/common/DynamicForm";
import { educationFormConfig } from "@/app/config/form-configs";
import { Education } from "@/app/components/Educations/educations.types";

interface EducationFormProps {
  education: Education;
  onDeleteClick: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
}

export const EducationForm = ({
  education,
  onDeleteClick,
  onFormChange,
}: EducationFormProps) => {
  const config = {
    ...educationFormConfig,
    onDelete: onDeleteClick,
    onFormChange,
  };

  return <DynamicForm data={education} config={config} />;
};
