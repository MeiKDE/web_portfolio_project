"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import {
  getCurrentDate,
  formatCertificationsForUI,
} from "@/app/hooks/date-utils";
import { Certification } from "./certifications/Interface";
import { handleDeleteCertification } from "./certifications/HandleDeleteCertification";
import { handleSaveCertifications } from "./certifications/HandleSaveCertifications";
import { NewCertification } from "./certifications/add_new_certification/NewCertification";
import { AddButton } from "./ui/AddButton";
import { DoneButton } from "./ui/DoneButton";
import { EditButton } from "./ui/EditButton";
import CertificationList from "./certifications/display_certifications/CertificationList";

interface CertificationsProps {
  userId: string;
}

// This function is used to display the certifications section in the profile page
export default function Certifications({ userId }: CertificationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editedData, setEditedData] = useState<Certification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [saveSuccess, setSaveSuccess] = useState(false);
  // const [newItemData, setNewItemData] = useState<any>(null);
  // const [newItemErrors, setNewItemErrors] = useState<{ [key: string]: string }>(
  //   {}
  // );

  const startEditing = () => {
    console.log("ln11: startEditing");
    setIsEditing(true);
    if (data) {
      setEditedData(formatCertificationsForUI(data));
    }
  };
  const startAddingNew = (defaultNewItem: Certification[]) => {
    setIsAddingNew(true);
    setEditedData(defaultNewItem);
    // setNewItemData(defaultNewItem);
  };
  const handleDeleteItem = async ({
    id,
    confirmMessage = "Are you sure you want to delete this item?",
    endpoint,
    filterFn,
    onSuccess,
    onError,
  }: {
    id: string;
    confirmMessage?: string;
    endpoint: string;
    filterFn?: (item: any) => boolean;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to delete item: ${errorData.error || response.statusText}`
        );
      }

      // Remove from local state
      if (Array.isArray(editedData) && filterFn) {
        setEditedData(editedData.filter(filterFn) as Certification[]);
      }

      onSuccess?.(); // Call success callback if provided
    } catch (error) {
      console.error("Error deleting item:", error);
      onError?.(error); // Call error callback if provided
    }
  };
  // Helper function to format item for API
  // const formatItemForApi = (item: any, dateFields: string[] = []) => {
  //   const formatted = { ...item };

  //   // Process specified date fields
  //   for (const field of dateFields) {
  //     if (formatted[field]) {
  //       formatted[field] = new Date(formatted[field]).toISOString();
  //     } else if (formatted[field] === "") {
  //       formatted[field] = null;
  //     }
  //   }

  //   return formatted;
  // };
  const handleSaveEdits = async ({
    endpoint,
    dateFields = [],
    validateFn,
    onSuccess,
    onError,
  }: {
    endpoint: string;
    dateFields?: string[];
    validateFn?: (data: any) => boolean | string | null;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    try {
      // Optional validation check
      if (validateFn && editedData) {
        const validationResult = validateFn(editedData);
        if (validationResult !== true && validationResult !== null) {
          console.error("Validation errors:", validationResult);
          onError?.(new Error(`Validation failed: ${validationResult}`));
          return;
        }
      }

      setIsSubmitting(true);

      if (!editedData) {
        console.warn("No data to update");
        return;
      }

      // Handle both array and single object cases
      const itemsToUpdate = Array.isArray(editedData)
        ? editedData
        : [editedData];

      for (const item of itemsToUpdate) {
        // Format the item for API, particularly handling date fields
        const formattedItem = formatItemForApi(item, dateFields);

        const itemId = item.id;
        const itemEndpoint = itemId ? `${endpoint}/${itemId}` : endpoint;

        const response = await fetch(itemEndpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formattedItem),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to update item: ${errorData.error || response.statusText}`
          );
        }
      }

      setIsEditing(false);
      // setSaveSuccess(true);
      onSuccess?.(); // Call success callback if provided
    } catch (error) {
      console.error("Error saving changes:", error);
      onError?.(error); // Call error callback if provided
    } finally {
      setIsSubmitting(false);
    }
  };
  const cancelAddingNew = () => {
    setIsAddingNew(false);
    // setNewItemData(null);
    // setNewItemErrors({});
  };
  const handleInputChange = (id: string | null, field: string, value: any) => {
    setEditedData((prev) => {
      if (!prev) return prev;

      if (Array.isArray(prev)) {
        return prev.map((item: any) =>
          item.id === id ? { ...item, [field]: value } : item
        ) as Certification[];
      }

      if (
        typeof prev === "object" &&
        prev !== null &&
        "id" in prev &&
        id === (prev as any).id
      ) {
        return [{ ...(prev as any), [field]: value }] as Certification[];
      }

      return [{ ...(prev as any), [field]: value }] as Certification[];
    });
  };

  // Fetch certifications data
  const { data, isLoading, error, mutate } = useFetchData<Certification[]>(
    `/api/users/${userId}/certifications`
  );
  // Update local state when data is fetched - ensure this happens correctly
  useEffect(() => {
    if (data && data.length > 0) {
      // Make sure to set the formatted data when not in editing or adding mode
      if (!isEditing && !isAddingNew) {
        setEditedData(formatCertificationsForUI(data));
      }
    } else if (data && data.length === 0) {
      // If there's no data, set an empty array
      setEditedData([]);
    }
  }, [data, setEditedData, isEditing, isAddingNew]);
  // Also ensure data is correctly reset when exiting edit/add modes
  useEffect(() => {
    if (!isEditing && !isAddingNew && data) {
      setEditedData(formatCertificationsForUI(data));
    }
  }, [isEditing, isAddingNew, data, setEditedData]);

  if (isLoading) return <div>Loading certifications...</div>;
  if (error) return <div>Error loading certification information</div>;

  const onClickAddNew = () =>
    startAddingNew([
      {
        id: "new",
        name: "",
        issuer: "",
        issueDate: getCurrentDate(),
        expirationDate: "",
        credentialUrl: "",
      },
    ]);

  const onClickDone = () => {
    handleSaveCertifications(handleSaveEdits, mutate);
  };

  const onClickEdit = () => {
    if (data) {
      startEditing();
      setEditedData(formatCertificationsForUI(data));
    } else {
      startEditing();
    }
  };

  const onChangeHandler = (id: string, field: string, value: any) => {
    handleInputChange(id, field, value);
  };

  const onClickHandler = (id: string) => {
    handleDeleteCertification(id, handleDeleteItem, mutate);
  };

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

        {/* Add New Certification Entry */}
        {isAddingNew && (
          <NewCertification
            mutate={mutate}
            cancelAddingNew={cancelAddingNew}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          ></NewCertification>
        )}

        {/* Certifications List - show all items by default */}
        {!isLoading && !error ? (
          <>
            {editedData && editedData.length > 0 ? (
              <div className="space-y-4">
                {editedData.map((certification) => (
                  <CertificationList
                    key={certification.id}
                    certification={certification}
                    isEditing={isEditing}
                    onChangeHandler={onChangeHandler}
                    onClickHandler={onClickHandler}
                    getCurrentDate={getCurrentDate}
                  />
                ))}
              </div>
            ) : (
              !isAddingNew && (
                <div className="text-center py-4 text-muted-foreground">
                  No certifications found. Add your certifications to showcase
                  your professional credentials.
                </div>
              )
            )}
          </>
        ) : isLoading ? (
          <div className="text-center py-4">Loading certifications...</div>
        ) : (
          <div className="text-center py-4 text-red-500">
            Error loading certification information
          </div>
        )}
      </CardContent>
    </Card>
  );
}
