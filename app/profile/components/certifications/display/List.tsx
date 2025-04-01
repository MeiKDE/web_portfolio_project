import { Certification } from "@/app/profile/components/certifications/Interface";
import { useState, useEffect } from "react";
import { DeleteCertification } from "@/app/profile/components/certifications/DeleteCertification";
import { NameInput } from "@/app/profile/components/certifications/display/child/list/NameInput";
import { IssuerInput } from "@/app/profile/components/certifications/display/child/list/IssuerInput";
import { DateInputs } from "@/app/profile/components/certifications/display/child/list/DateInputs";
import { UrlInput } from "@/app/profile/components/certifications/display/child/list/UrlInput";
import { DeleteButton } from "@/app/profile/components/ui/DeleteBtn";

interface CertificationListProps {
  editedData: Certification[];
  isEditing: boolean;
  mutate: () => Promise<any>;
}

export function CertificationList({
  editedData,
  isEditing,
  mutate,
}: CertificationListProps) {
  const [localData, setLocalData] = useState<Certification[]>(editedData);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    setLocalData(editedData);
  }, [editedData]);

  const deleteItemFromLocalState = async (id: string) => {
    try {
      setLocalData((prev) => prev.filter((cert) => cert.id !== id));
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting item:", error);
      return Promise.reject(error);
    }
  };

  const deleteItemFromDatabase = async (id: string) => {
    try {
      await DeleteCertification(id, deleteItemFromLocalState, mutate);
    } catch (error) {
      console.error("Error deleting item from database:", error);
    }
  };

  const onDeleteClick = async (certificationId: string) => {
    try {
      setIsDeleting(certificationId);
      await deleteItemFromDatabase(certificationId);
    } catch (error) {
      console.error("Error in onDeleteClick:", error);
      alert("Failed to delete certification. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const certificationInputChange = (id: string, field: string, value: any) => {
    setLocalData((prev) =>
      prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  return (
    <div className="space-y-4">
      {localData.map((certification) => (
        <div
          key={certification.id}
          className="relative border-b pb-4 last:border-0"
        >
          {isEditing ? (
            <div className="flex gap-2">
              <div className="w-full">
                <NameInput
                  formData={certification}
                  errors={{}}
                  handleInputChange={(field, value) =>
                    certificationInputChange(certification.id, field, value)
                  }
                />
                <IssuerInput
                  formData={certification}
                  errors={{}}
                  handleInputChange={(field, value) =>
                    certificationInputChange(certification.id, field, value)
                  }
                />
                <DateInputs
                  formData={certification}
                  errors={{}}
                  handleInputChange={(field, value) =>
                    certificationInputChange(certification.id, field, value)
                  }
                />
                <UrlInput
                  formData={certification}
                  errors={{}}
                  handleInputChange={(field, value) =>
                    certificationInputChange(certification.id, field, value)
                  }
                />
              </div>
              <div className="flex items-start">
                <DeleteButton
                  onDeleteClick={onDeleteClick}
                  isDeleting={isDeleting}
                  skillId={certification.id}
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium">{certification.name}</h3>
              <p className="text-sm text-gray-600">{certification.issuer}</p>
              <p className="text-sm text-gray-600">
                Issued: {new Date(certification.issueDate).toLocaleDateString()}
                {certification.expirationDate &&
                  ` • Expires: ${new Date(
                    certification.expirationDate
                  ).toLocaleDateString()}`}
              </p>
              {certification.credentialUrl && (
                <a
                  href={certification.credentialUrl}
                  className="text-sm text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View credential
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
