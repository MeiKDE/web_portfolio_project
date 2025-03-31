"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Certification } from "./certifications/Interface";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "./ui/AddButton";
import { EditButton } from "./ui/EditButton";
import { DoneButton } from "./ui/DoneButton";
import { FormValidation } from "@/app/profile/components/certifications/display/child/FormValidation";
import { NewCertification } from "./certifications/add/NewCertification";
import { CertificationList } from "./certifications/display/List";
import { formatCertificationsForUI } from "@/app/hooks/date-utils";

interface CertificationsProps {
  userId: string;
}

export default function Certifications({ userId }: CertificationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editedData, setEditedData] = useState<Certification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [values, setValues] = useState<Record<string, any>>({
    name: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialUrl: "",
  });

  // Fetch certifications data
  const { data, isLoading, error, mutate } = useFetchData<Certification[]>(
    `/api/users/${userId}/certifications`
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      try {
        // Always update editedData when data changes
        console.log("refreshed data", data);
        setEditedData(formatCertificationsForUI(data));
      } catch (error) {
        console.error("Error processing certifications data:", error);
        setEditedData([]);
      }
    }
  }, [data]); // Depends on data change

  useEffect(() => {
    if (saveSuccess) {
      const refreshData = async () => {
        await mutate();
        setSaveSuccess(false);
        setIsSubmitting(false);
        setIsAddingNew(false); // This will hide the form
      };
      refreshData();
    }
  }, [saveSuccess, mutate]);

  const onClickAddNew = () => {
    setIsAddingNew(true);
    setValues({
      name: "",
      issuer: "",
      issueDate: "",
      expirationDate: "",
      credentialUrl: "",
    });
  };

  const onClickDone = () => {
    handleSaveEdits({
      endpoint: `/api/certifications`,
      validateFn: (data: any) => {
        setEditedData(data); // added this line to set the editedData to the data
        return true;
      },
      onSuccess: () => {
        mutate();
        setIsEditing(false);
        setSaveSuccess(true);
      },
      onError: (error: any) => {
        console.error("Error saving certifications:", error);
        alert("Failed to save certifications. Please try again.");
      },
    });
  };

  const onClickEdit = () => {
    if (data) {
      setIsEditing(true);
      setEditedData(formatCertificationsForUI(data));
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveEdits = async ({
    endpoint,
    validateFn,
    onSuccess,
    onError,
  }: {
    endpoint: string;
    validateFn?: (data: any) => boolean | string | null;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    try {
      if (validateFn && editedData) {
        const validationResult = validateFn(editedData);

        if (validationResult !== true && validationResult !== null) {
          onError?.(new Error(`Validation failed: ${validationResult}`));
          return;
        }
      }

      setIsSubmitting(true);

      if (!editedData) {
        console.warn("No data to update");
        return;
      }

      const itemsToUpdate = Array.isArray(editedData)
        ? editedData
        : [editedData];

      for (const item of itemsToUpdate) {
        const response = await fetch(`${endpoint}/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(item),
        });
        console.log("ln143: response", response);
        // update the data
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to update item: ${errorData.error || response.statusText}`
          );
        }
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving changes:", error);
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSave = async () => {
    setIsAddingNew(false);
    await mutate();
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading certification information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>
          <div className="flex gap-2">
            {!isAddingNew && !isEditing && (
              <AddButton onClick={onClickAddNew} />
            )}
            {isEditing ? (
              <DoneButton onClick={onClickDone} isSubmitting={isSubmitting} />
            ) : (
              !isAddingNew && (
                <>
                  <EditButton onClick={onClickEdit} />
                </>
              )
            )}
          </div>
        </div>

        {/* Add validation error messages */}
        {isEditing &&
          editedData?.map((certification) => (
            <FormValidation
              key={certification.id}
              certification={certification}
            />
          ))}

        {/* Add New Certification Entry */}
        {isAddingNew && <NewCertification userId={userId} onSave={onSave} />}

        {/* Certifications List */}
        {!isLoading && !error && (
          <>
            {editedData && editedData.length > 0 ? (
              <CertificationList
                editedData={editedData}
                isEditing={isEditing}
              />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No certifications found. Add your certifications to showcase
                your professional credentials.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
