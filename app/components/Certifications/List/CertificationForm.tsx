import { DynamicForm } from "@/app/components/common/DynamicForm";
import { certificationFormConfig } from "@/app/config/form-configs";
import { Certification } from "@/app/components/Certifications/certifications.types";

interface CertificationFormProps {
  certification: Certification;
  onDelete: (id: string) => void;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  isEditing: boolean;
  formData: Certification[];
  setFormData: React.Dispatch<React.SetStateAction<Certification[]>>;
}

export const CertificationForm = ({
  certification,
  onDelete,
  onChangeFormData,
  isEditing,
  formData,
  setFormData,
}: CertificationFormProps) => {
  const config = {
    ...certificationFormConfig,
    onDelete,
    onFormChange: onChangeFormData,
    disabled: !isEditing,
  };

  return (
    <DynamicForm
      data={certification}
      config={config}
      formData={formData}
      setFormData={setFormData}
    />
  );
};
