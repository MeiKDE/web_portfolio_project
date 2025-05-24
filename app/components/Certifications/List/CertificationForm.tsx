import { DynamicForm } from "@/app/components/common/DynamicForm";
import { certificationFormConfig } from "@/app/config/form-configs";
import { Certification } from "@/app/components/Certifications/certifications.types";
import { DeleteButton } from "@/app/components/ui/DeleteButton";

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
  isMarkedForDeletion: boolean;
}

export function CertificationForm({
  certification,
  onDelete,
  onChangeFormData,
  isMarkedForDeletion,
  onDone,
}: CertificationFormProps) {
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
    <div className={`relative ${isMarkedForDeletion ? "opacity-50" : ""}`}>
      <div className="absolute right-2 top-2">
        <DeleteButton
          onClick={() => onDelete(certification)}
          isMarkedForDeletion={isMarkedForDeletion}
        />
      </div>
      <DynamicForm
        data={certification}
        config={config}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}
