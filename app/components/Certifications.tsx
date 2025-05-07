"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewCertification } from "@/app/components/Certifications/NewCertification";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { CertificationForm } from "./Certifications/List/CertificationForm";
import { CertificationItem } from "./Certifications/List/CertificationItem";
import { useCertificationsContext } from "/Users/mei/projects/Web_Portfolio/context/CertificationsContext";

interface CertificationsProps {
  userId: string;
}

export default function Certifications({ userId }: CertificationsProps) {
  const {
    isAdding,
    isEditing,
    isSubmitting,
    formData,
    isValidMap,
    setIsAdding,
    setIsEditing,
    onUpdateBatch,
    onSaveNew,
    onChangeFormData,
    onDelete,
  } = useCertificationsContext();

  const { isLoading, error } = useFetchData(
    `/api/users/${userId}/certifications`
  );

  // Define onAddNew here since it's not in the context
  const onAddNew = () => setIsAdding(true);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading certifications information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>
          <div className="flex gap-2">
            {!isAdding && !isEditing && <AddButton onClick={onAddNew} />}
            {!isEditing && !isAdding && (
              <EditButton onClick={() => setIsEditing(true)} />
            )}
            {isEditing && (
              <DoneButton
                onClick={onUpdateBatch}
                isSubmitting={isSubmitting}
                disabled={
                  !Array.from(isValidMap.values()).every((isValid) => isValid)
                }
              />
            )}
          </div>
        </div>

        {isAdding && (
          <NewCertification
            onSaveNew={onSaveNew}
            userId={userId}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {!isEditing ? (
          <>
            {formData.length > 0 &&
              formData.map((cert) => (
                <div
                  key={cert.id}
                  className="relative border-b pb-4 last:border-0"
                >
                  <CertificationItem certification={cert} />
                </div>
              ))}
          </>
        ) : (
          <>
            {formData.map((cert) => (
              <div key={cert.id}>
                <CertificationForm
                  onChangeFormData={onChangeFormData}
                  certification={cert}
                  onDelete={onDelete}
                  isEditing={isEditing}
                />
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
