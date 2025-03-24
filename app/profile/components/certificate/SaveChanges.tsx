//  Save changes to existing certifications
import { validateCertifications } from "./ValidateCertifications";
import {
  formatDateForInput,
  formatDateForDatabase,
  getCurrentDate,
  formatCertificationsForUI,
} from "@/app/hooks/date-utils";

// Add interface for the certification type
interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export const saveChanges = async (
  editedData: Certification[] | null,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setIsEditing: (isEditing: boolean) => void,
  setSaveSuccess: (saveSuccess: boolean) => void,
  mutate: () => void
) => {
  try {
    const validationErrors = validateCertifications(editedData);
    if (validationErrors) {
      console.error("Validation errors:", validationErrors);
      alert("Please fix the validation errors before saving");
      return;
    }

    setIsSubmitting(true);

    if (!editedData) return;

    for (const certification of editedData) {
      const payload = {
        name: certification.name.trim(),
        issuer: certification.issuer.trim(),
        issueDate: formatDateForDatabase(certification.issueDate),
        expirationDate:
          certification.expirationDate &&
          certification.expirationDate.trim() !== ""
            ? formatDateForDatabase(certification.expirationDate)
            : null,
        credentialUrl:
          certification.credentialUrl &&
          certification.credentialUrl.trim() !== ""
            ? certification.credentialUrl.trim()
            : null,
      };

      const response = await fetch(`/api/certifications/${certification.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update certification: ${
            errorData.error || response.statusText
          }`
        );
      }
    }

    setIsEditing(false);
    setSaveSuccess(true);
    mutate(); // Re-fetch data
  } catch (error) {
    console.error("Error saving changes:", error);
    alert(
      `Error updating certifications: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    setIsSubmitting(false);
  }
};
