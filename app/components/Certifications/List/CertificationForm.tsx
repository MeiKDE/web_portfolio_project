import { DynamicForm } from "@/app/components/common/DynamicForm";
import { certificationFormConfig } from "@/app/config/form-configs";
import { Certification } from "@/app/components/Certifications/certifications.types";

interface CertificationFormProps {
  certification: Certification;
  onDeleteClick: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
}

export const CertificationForm = ({
  certification,
  onDeleteClick,
  onFormChange,
}: CertificationFormProps) => {
  const config = {
    ...certificationFormConfig,
    onDelete: onDeleteClick,
    onFormChange,
  };

  return <DynamicForm data={certification} config={config} />;
};
