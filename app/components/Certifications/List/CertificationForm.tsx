import { DynamicForm } from "@/app/components/common/DynamicForm";
import { certificationFormConfig } from "@/app/config/form-configs";
import { Certification } from "@/app/components/Certifications/certifications.types";

interface CertificationFormProps {
  certification: Certification;
  onDelete: (cert: Certification) => void;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  onDone: () => void;
}

export const CertificationForm = ({
  certification,
  onDelete,
  onChangeFormData,
  onDone,
}: CertificationFormProps) => {
  const config = {
    ...certificationFormConfig,
    onDelete,
    onFormChange: onChangeFormData,
    disabled: !onDone,
  };

  const handleFieldChange = (
    field: string,
    value: string,
    isValid: boolean
  ) => {
    onChangeFormData(certification.id, field, value, isValid);
  };

  return (
    <DynamicForm
      data={certification}
      config={config}
      onFieldChange={handleFieldChange}
    />
  );
};
