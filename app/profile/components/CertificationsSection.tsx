"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import {
  getCurrentDate,
  formatCertificationsForUI,
} from "@/app/hooks/date-utils";
import { Certification } from "./certifications/Interface";
import { NewCertification } from "./certifications/add/NewCertification";
import { AddButton } from "./ui/AddButton";
import { DoneButton } from "./ui/DoneButton";
import { EditButton } from "./ui/EditButton";
import { CertificationList } from "./certifications/display/List";
import { FormValidation } from "./certifications/add/child/new-certification/FormValidation";

interface CertificationsProps {
  userId: string;
}

// This function is used to display the certifications section in the profile page
export default function Certifications({ userId }: CertificationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
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

  // Fetch the certifications data
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
        console.error("Error formatting certifications:", error);
        setEditedData([]);
      }
    }
  }, [data]); //Depends on data change

  //this is used to refresh the data after saving a new certification
  // setting saveSuccess to false will trigger this useEffect
  // saveSuccess is set to false when the data is refreshed
  //isSubmitting is set to false when the data is refreshed
  //isAddingNew is set to false when the data is refreshed
  useEffect(() => {
    if (saveSuccess) {
      const refreshData = async () => {
        await mutate();
        setSaveSuccess(false);
        setIsSubmitting(false);
        setIsAddingNewItem(false); // This will hide the form
      };
      refreshData();
    }
  }, [saveSuccess, mutate]);

  const onClickAddNew = () => {
    setIsAddingNewItem(true);
    setEditedData([
      {
        id: "new",
        name: "",
        issuer: "",
        issueDate: getCurrentDate(),
        expirationDate: "",
        credentialUrl: "",
      },
    ]);
  };

  const onClickDone = () => {
    handleSaveEdits({
      endpoint: `/api/certifications`,
      validateFn: (data) => {
        try {
          // Validate each certification
          if (Array.isArray(data)) {
            data.forEach((certification) => {
              if (
                !certification.name ||
                !certification.issuer ||
                !certification.issueDate ||
                !certification.expirationDate ||
                !certification.credentialUrl
              ) {
                throw new Error("All required fields must be filled");
              }
            });
          }
          return true;
        } catch (error) {
          console.error("Validation error:", error);
          alert("Please fill out all required fields correctly");
          return false;
        }
      },
      onSuccess: () => {
        mutate(); // refresh the data
        setIsEditing(false); // to false because the data is not being edited
        setSaveSuccess(true); // to true because the data is saved successfully
      },
      onError: (error: any) => {
        console.error("Error saving certifications:", error);
        alert("Failed to save certifications. Please try again.");
      },
    });
  };

  // used to edit the certifications
  const onClickEdit = () => {
    if (data) {
      console.log("ln11: onClickEdit");
      setIsEditing(true);
      setEditedData(formatCertificationsForUI(data));
    } else {
      setIsEditing(true);
    }
  };

  // this is used to save and update the data
  const handleSaveEdits = async ({
    endpoint,
    validateFn, // returns true if the data is valid
    onSuccess, // called when the data is saved successfully
    onError, // called when the data is not saved successfully
  }: {
    endpoint: string;
    validateFn?: (data: any) => boolean | string | null;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    try {
      if (validateFn && editedData) {
        const validationResult = validateFn(editedData); // validate the data

        // if the data is not valid, call the onError function
        if (validationResult !== true && validationResult !== null) {
          onError?.(new Error(`Validation failed: ${validationResult}`));
          return;
        }
      }
      // setting to true because the data is being updated
      // and will trigger the useEffect that refreshes the data
      setIsSubmitting(true);

      // if there is no data to update
      if (!editedData) {
        console.warn("No data to update");
        return;
      }

      // if the data is an array, use the array
      // if the data is not an array, make it an array
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

        // update the data
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to update item: ${errorData.error || response.statusText}`
          );
        }
      }
      // reset the form after saving the data
      onSuccess?.(); // call the onSuccess function to refresh the data
    } catch (error) {
      console.error("Error saving changes:", error);
      onError?.(error); // call the onError function to display an error message
    } finally {
      setIsSubmitting(false); // to false because the data is not being updated
    }
  };

  const onSave = async () => {
    console.log("onSave function called");
    setIsAddingNewItem(false);
    console.log("setIsAddingNewItem");
    await mutate(); // refresh the data
    console.log("mutate");
  };
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading skill information</div>;

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

        {/* Add validation error messages */}
        {isEditing &&
          editedData?.map((certification, index) => (
            <FormValidation
              key={certification.id}
              certification={certification}
            />
          ))}

        {/* Add New Certification Entry */}
        {isAddingNewItem && (
          <NewCertification userId={userId} onSave={onSave}></NewCertification>
        )}

        {/* Certifications List - show all items by default */}
        {!isLoading && !error ? (
          <>
            {editedData && editedData.length > 0 ? (
              <CertificationList
                editedData={editedData}
                isEditing={isEditing}
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
          <LoadingSpinner />
        ) : (
          <div className="text-center py-4 text-red-500">
            Error loading certification information
          </div>
        )}
      </CardContent>
    </Card>
  );
}
