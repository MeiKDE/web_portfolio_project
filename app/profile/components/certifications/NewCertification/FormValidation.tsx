import { Certification } from "@/app/profile/components/Certifications/certifications.types";

interface FormValidationProps {
  certification: Certification;
  touchedFields?: Record<string, boolean>;
}

// Add a validation function that can be exported
export const validateCertification = (
  certification: Certification
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  if (!certification.name) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (!certification.issuer) {
    errors.issuer = "Issuer is required";
    isValid = false;
  }

  if (!certification.issueDate) {
    errors.issueDate = "Issue date is required";
    isValid = false;
  }

  return { isValid, errors };
};

export const FormValidation = ({
  certification,
  touchedFields = {},
}: FormValidationProps) => {
  return (
    <div className="text-sm text-red-500">
      {touchedFields.name && !certification.name && <p>Name is required</p>}
      {touchedFields.issuer && !certification.issuer && (
        <p>Issuer is required</p>
      )}
      {touchedFields.issueDate && !certification.issueDate && (
        <p>Issue date is required</p>
      )}
    </div>
  );
};
