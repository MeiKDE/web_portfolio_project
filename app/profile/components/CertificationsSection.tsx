"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import {
  getCurrentDate,
  formatCertificationsForUI,
} from "@/app/hooks/date-utils";
import { Certification } from "./certifications/Interface";
import { DeleteCertification } from "./certifications/DeleteCertification";
import { SaveCertifications } from "./certifications/SaveCertifications";
import { NewCertification } from "./certifications/add_new/NewCertification";
import { AddButton } from "./ui/AddButton";
import { DoneButton } from "./ui/DoneButton";
import { EditButton } from "./ui/EditButton";
import { CertificationList } from "./certifications/display/List";

interface CertificationsProps {
  userId: string;
}

// This function is used to display the certifications section in the profile page
export default function Certifications({ userId }: CertificationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [editedData, setEditedData] = useState<Certification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // used to edit the certifications
  const onClickEdit = () => {
    console.log("ln11: onClickEdit");
    setIsEditing(true);
    if (data) {
      setEditedData(formatCertificationsForUI(data));
    }
  };

  // used to add a new certification
  const startAddingNewItem = (defaultNewItem: Certification[]) => {
    setIsAddingNewItem(true);
    setEditedData(defaultNewItem);
  };

  const handleDeleteItem = async (id: string) => {
    const confirmMessage = "Are you sure you want to delete this item?";
    const endpoint = `/api/certifications/${id}`;
    //const filterFn = (item: any) => item.id !== id; //filter function to remove the item from the list
    const onSuccess = async () => {
      await mutate(); //refresh the data
    };
    const onError = (error: any) => {
      console.error("Error deleting item:", error);
    };

    // if reject confirm message, then return
    // which stops the function from executing further
    if (!confirm(confirmMessage)) {
      return;
    }
    // else, try to delete the item
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });
      onSuccess(); //refresh the data
    } catch (error) {
      onError(error); //log the error
    }
  };

  // TODO: Check if this is needed
  // TODO: Review code from this point onwards
  // Helper function to format item for API
  const formatItemForApi = (item: any, dateFields: string[] = []) => {
    const formatted = { ...item };

    // Process specified date fields
    for (const field of dateFields) {
      if (formatted[field]) {
        formatted[field] = new Date(formatted[field]).toISOString();
      } else if (formatted[field] === "") {
        formatted[field] = null;
      }
    }
    return formatted;
  };

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
    setIsAddingNewItem(false);
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
      if (!isEditing && !isAddingNewItem) {
        setEditedData(formatCertificationsForUI(data));
      }
    } else if (data && data.length === 0) {
      // If there's no data, set an empty array
      setEditedData([]);
    }
  }, [data, setEditedData, isEditing, isAddingNewItem]);
  // Also ensure data is correctly reset when exiting edit/add modes
  useEffect(() => {
    if (!isEditing && !isAddingNewItem && data) {
      setEditedData(formatCertificationsForUI(data));
    }
  }, [isEditing, isAddingNewItem, data, setEditedData]);

  if (isLoading) return <div>Loading certifications...</div>;
  if (error) return <div>Error loading certification information</div>;

  const onSave = async () => {
    console.log("onSave function called");
    setIsAddingNewItem(false);
    console.log("setIsAddingNewItem");
    await mutate(); // refresh the data
    console.log("mutate");
  };

  const onClickAddNew = () =>
    startAddingNewItem([
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
    SaveCertifications(handleSaveEdits, mutate);
  };

  // const onClickEdit = () => {
  //   startEditing();
  // };

  const onChangeHandler = (id: string, field: string, value: any) => {
    handleInputChange(id, field, value);
  };

  // const onClickHandler = (id: string) => {
  //   DeleteCertification(id, handleDeleteItem, mutate);
  // };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>
          <div className="flex gap-2">
            {!isAddingNewItem && !isEditing && (
              <AddButton onClick={onClickAddNew} />
            )}
            {isEditing ? (
              <DoneButton onClick={onClickDone} isSubmitting={isSubmitting} />
            ) : (
              !isAddingNewItem && (
                <>
                  <EditButton onClick={onClickEdit} />
                </>
              )
            )}
          </div>
        </div>

        {/* Add New Certification Entry */}
        {isAddingNewItem && (
          <NewCertification
            cancelAddingNew={cancelAddingNew}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSave={onSave}
          ></NewCertification>
        )}

        {/* Certifications List - show all items by default */}
        {!isLoading && !error ? (
          <>
            {editedData && editedData.length > 0 ? (
              <CertificationList
                editedData={editedData}
                isEditing={isEditing}
                handleCertificationInputChange={(
                  id,
                  field,
                  value,
                  handleInputChange,
                  touchField
                ) => {
                  onChangeHandler(id, field, value);
                }}
                DeleteCertification={DeleteCertification}
                handleDeleteItem={handleDeleteItem}
                mutate={mutate}
                getCurrentDate={getCurrentDate}
              />
            ) : (
              !isAddingNewItem && (
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
