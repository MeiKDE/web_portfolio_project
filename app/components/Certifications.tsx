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
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const [certificationsData, setCertificationsData] = useState<Certification[]>(
    []
  );
  const [formData, setFormData] = useState<Certification[]>([]);
  const [changedCertificationId, setChangedCertificationId] = useState<
    Set<string>
  >(new Set());
  const [isCertificationValidMap, setIsCertificationValidMap] = useState<
    Map<string, boolean>
  >(new Map());

  const { data, isLoading, error, mutate } = useFetchData<Certification[]>(
    `/api/users/${userId}/certifications`
  );

  useEffect(() => {
    if (data) {
      setCertificationsData(formatCertificationsForUI(data));
      setFormData(formatCertificationsForUI(data));
    }
  }, [data]);

  const onAddNewCertification = () => setIsAddingNewItem(true);

  const onDeleteCertification = async (id: string | null) => {
    try {
      setIsSubmittingItem(true);
      const response = await fetch(`/api/certifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete certification");
      }
      toast.success("Certification deleted successfully");
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast.error("Error deleting certification");
    } finally {
      mutate(); // Refresh the data thus re-fetches the skills data by calling the useFetchData hook again
      setIsSubmittingItem(false);
    }
  };

  const updateCertification = async (id: string, certObject: Certification) => {
    const formattedCert = {
      ...certObject,
      issueDate: formatDateForDatabase(certObject.issueDate),
      expirationDate: certObject.expirationDate
        ? formatDateForDatabase(certObject.expirationDate)
        : null,
    };

    const response = await fetch(`/api/certifications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedCert),
    });

    if (!response.ok) {
      throw new Error("Failed to update certification");
    }
  };

  const onUpdateCertificationList = async () => {
    setIsSubmittingItem(true);
    setIsEditingMode(true);

    try {
      for (const cert of formData) {
        if (changedCertificationId.has(cert.id)) {
          await updateCertification(cert.id, cert);
        }
      }
      toast.success("Certifications updated successfully");
    } catch (error) {
      console.error("Error updating certifications:", error);
      toast.error("Error updating certifications");
    } finally {
      mutate();
      setIsSubmittingItem(false);
      setIsEditingMode(false);
    }
  };

  const onSaveNewCertification = async (certObject: Certification) => {
    try {
      setIsSubmittingItem(true);
      setIsAddingNewItem(false);

      const formattedCert = {
        ...certObject,
        issueDate: formatDateForDatabase(certObject.issueDate),
        expirationDate: certObject.expirationDate
          ? formatDateForDatabase(certObject.expirationDate)
          : null,
      };

      const response = await fetch(`/api/certifications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedCert),
      });

      if (!response.ok) {
        throw new Error("Failed to add certification");
      }
      toast.success("Certification added successfully");
    } catch (error) {
      console.error("Error adding new certification:", error);
      toast.error("Error adding new certification");
    } finally {
      mutate();
      setIsSubmittingItem(false);
    }
  };

  const onCertificationChange = (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => {
    setFormData((prev) => {
      return prev.map((cert) => {
        setIsCertificationValidMap((prev) => {
          prev.set(id, isFormValid);
          return prev;
        });
        if (cert.id === id) {
          setChangedCertificationId((prev) => {
            prev.add(id);
            return prev;
          });
          return { ...cert, [field]: value };
        }
        return cert;
      });
    });
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
            {!isAddingNewItem && !isEditingMode && (
              <AddButton onClick={onAddNewCertification} />
            )}
            {/* When not adding and editing, the Edit button will be shown */}
            {/* or When adding or editing, EDIT button will not be shown */}
            {!isEditingMode && !isAddingNewItem && (
              <EditButton
                onClick={() => {
                  setIsEditingMode(true);
                }}
              />
            )}
            {isEditingMode && (
              <DoneButton
                onClick={onUpdateCertificationList}
                isSubmitting={isSubmittingItem}
                disabled={
                  !isCertificationValidMap.values().every((isValid) => isValid)
                }
              />
            )}
          </div>
        </div>

        {/* Add New Skill Entry */}
        {isAddingNewItem && (
          <NewCertification
            onSaveNewCertification={onSaveNewCertification}
            userId={userId}
          />
        )}

        {/* When not editing, the CertificationForm will be shown */}
        {!isEditingMode ? (
          <>
            {/* When not loading, not error, and certifications data is available,
            and certifications data length is greater than 0, the
            CertificationForm will be shown */}
            {!isLoading &&
              !error &&
              certificationsData &&
              certificationsData.length > 0 &&
              certificationsData.map((certification: Certification) => (
                <div
                  key={certification.id}
                  className="relative border-b pb-4 last:border-0"
                >
                  <CertificationItem certification={certification} />
                </div>
              ))}
          </>
        ) : (
          <>
            {formData.map((certification: Certification) => {
              return (
                <div key={certification.id}>
                  <CertificationForm
                    onFormChange={onCertificationChange}
                    certification={certification}
                    onDeleteClick={onDeleteCertification}
                  />
                </div>
              );
            })}
          </>
        )}
      </CardContent>
    </Card>
  );
}
