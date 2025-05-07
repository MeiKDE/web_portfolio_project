"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Certification } from "@/app/components/Certifications/certifications.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewCertification } from "@/app/components/Certifications/NewCertification";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import {
  formatDateForDatabase,
  formatCertificationsForUI,
} from "@/app/lib/utils/date-utils";

import { CertificationForm } from "./Certifications/List/CertificationForm";
import { CertificationItem } from "./Certifications/List/CertificationItem";

interface CertificationsProps {
  userId: string; // This is mapped to session.user.id from page.tsx
}

export default function Certifications({ userId }: CertificationsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Certification[]>([]);
  const [changedId, setChangedId] = useState<Set<string>>(new Set()); //Set is a collection of unique values
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map()); //Map is a collection of key-value pairs

  const { data, isLoading, error, mutate } = useFetchData<Certification[]>(
    `/api/users/${userId}/certifications`
  );

  useEffect(() => {
    if (data) {
      setFormData(formatCertificationsForUI(data));
    }
  }, [data]);

  const formatFormData = (cert: Certification) => ({
    ...cert,
    issueDate: formatDateForDatabase(cert.issueDate),
    expirationDate: cert.expirationDate
      ? formatDateForDatabase(cert.expirationDate)
      : null,
  });

  const onAddNew = () => setIsAdding(true);

  // Move these handlers to a custom hook for better separation of concerns
  const useCertificationHandlers = (userId: string, mutate: () => void) => {
    const handleDelete = async (id: string | null) => {
      if (!id) return;
      try {
        const res = await fetch(`/api/certifications/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error();
        toast.success("The certification is deleted successfully");
        mutate();
      } catch (err) {
        console.error("Error deleting certification:", err);
        toast.error("Error deleting certification");
      }
    };

    const handleUpdate = async (certification: Certification) => {
      if (!certification.id) return;
      try {
        const res = await fetch(`/api/certifications/${certification.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formatFormData(certification)),
        });
        if (!res.ok) throw new Error();
        toast.success("The certification has been updated");
      } catch (err) {
        console.error("Error updating certification:", err);
        toast.error("Failed to update certification");
      }
    };

    return { handleDelete, handleUpdate };
  };

  const { handleDelete, handleUpdate } = useCertificationHandlers(
    userId,
    mutate
  );

  // This function checks formData against the changeId useState Set.
  // Then updates the database for all the records appear in the changeId useState Set
  const onUpdateBatch = async () => {
    setIsSubmitting(true);
    setIsEditing(true);

    try {
      for (const cert of formData) {
        if (changedId.has(cert.id)) {
          await handleUpdate(cert);
        }
      }

      toast.success("List of certifications has been updated successfully");
      mutate(); // refresh the UI to reflect latest data
    } catch (error) {
      console.error("Error updating certifications:", error);
      toast.error("Error updating certifications");
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const onSaveNew = async (newCert: Certification) => {
    try {
      setIsSubmitting(true);
      setIsAdding(false);
      const response = await fetch(`/api/certifications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatFormData(newCert)),
      });

      if (!response.ok) {
        throw new Error("Failed to add certification");
      }
      toast.success("Certification added successfully");
      mutate();
    } catch (error) {
      console.error("Error adding new certification:", error);
      toast.error("Error adding new certification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeFormData = (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => {
    // Update the validity map with a new Map instance to avoid state mutation
    setIsValidMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, isFormValid);
      return newMap;
    });

    // Track the changed certification IDs using a new Set instance to avoid state mutation
    setChangedId((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });

    // Update the specific field in formData
    setFormData((prev) =>
      prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading certifications information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>
          <div className="flex gap-2">
            {/* When not adding and editing, the Add button will be shown */}
            {!isAdding && !isEditing && <AddButton onClick={onAddNew} />}
            {/* When not adding and editing, the Edit button will be shown */}
            {/* or When adding or editing, EDIT button will not be shown */}
            {!isEditing && !isAdding && (
              <EditButton
                onClick={() => {
                  setIsEditing(true);
                }}
              />
            )}
            {isEditing && (
              <DoneButton
                onClick={onUpdateBatch}
                isSubmitting={isSubmitting}
                // Disable the button unless every value in isValidMap is true.
                disabled={!isValidMap.values().every((isValid) => isValid)}
              />
            )}
          </div>
        </div>

        {/* Add New Skill Entry */}
        {isAdding && <NewCertification onSaveNew={onSaveNew} userId={userId} />}

        {/* When not editing, show CertificationItem */}
        {!isEditing ? (
          <>
            {!isLoading &&
              !error &&
              formData &&
              formData.length > 0 &&
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
                  onDelete={handleDelete}
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
