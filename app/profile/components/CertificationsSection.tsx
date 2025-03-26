"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, Save, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import {
  getCurrentDate,
  formatCertificationsForUI,
} from "@/app/hooks/date-utils";
import { Certification } from "./certifications/Interface";
import { handleDeleteCertification } from "./certifications/HandleDeleteCertification";
import { handleSaveCertifications } from "./certifications/HandleSaveCertifications";
import { NewCertification } from "./certifications/add_new_certificate/NewCertification";

interface CertificationsProps {
  userId: string;
}

// This function is used to display the certifications section in the profile page
export default function Certifications({ userId }: CertificationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editedData, setEditedData] = useState<Certification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newItemData, setNewItemData] = useState<any>(null);
  const [newItemErrors, setNewItemErrors] = useState<{ [key: string]: string }>(
    {}
  );

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
    setNewItemData(defaultNewItem);
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
      setSaveSuccess(true);
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
    setNewItemData(null);
    setNewItemErrors({});
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
  // const handleSaveNewItem = async ({
  //   event,
  //   requiredFields,
  //   formatData,
  //   endpoint,
  //   onSuccess,
  //   onError,
  // }: {
  //   event: React.FormEvent;
  //   requiredFields: string[];
  //   formatData: (data: any) => any;
  //   endpoint: string;
  //   onSuccess?: () => void;
  //   onError?: (error: any) => void;
  // }) => {
  //   event.preventDefault();

  //   if (!validateNewItem(requiredFields)) {
  //     return;
  //   }

  //   try {
  //     setIsSubmitting(true);
  //     const formattedData = formatData(newItemData);

  //     const response = await fetch(endpoint, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify(formattedData),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(
  //         `Failed to add item: ${errorData.error || response.statusText}`
  //       );
  //     }

  //     cancelAddingNew();
  //     onSuccess?.();
  //   } catch (error) {
  //     console.error("Error adding item:", error);
  //     onError?.(error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>
          <div className="flex gap-2">
            {!isAddingNew && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  startAddingNew([
                    {
                      id: "new",
                      name: "",
                      issuer: "",
                      issueDate: getCurrentDate(),
                      expirationDate: "",
                      credentialUrl: "",
                    },
                  ])
                }
              >
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              </Button>
            )}

            {isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleSaveCertifications(handleSaveEdits, mutate)
                }
                disabled={isSubmitting}
              >
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Done"}
                </>
              </Button>
            ) : (
              !isAddingNew && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (data) {
                      startEditing();
                      setEditedData(formatCertificationsForUI(data));
                    } else {
                      startEditing();
                    }
                  }}
                >
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                </Button>
              )
            )}
          </div>
        </div>

        {/* Add New Certification Form */}
        {isAddingNew && (
          <NewCertification
            mutate={mutate}
            cancelAddingNew={cancelAddingNew}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          ></NewCertification>
        )}

        {/* Certifications List - ensure we show all items when not in edit/add mode */}
        {!isLoading && !error ? (
          <>
            {editedData && editedData.length > 0 ? (
              <div className="space-y-4">
                {editedData.map((certification) => (
                  <div
                    key={certification.id}
                    className="relative border-b pb-4 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                        <CheckCircle className="h-4 w-4" />
                      </Badge>
                      <div className="flex-grow">
                        {isEditing ? (
                          // Show input fields when editing
                          <>
                            <Input
                              type="text"
                              value={certification.name}
                              onChange={(e) =>
                                handleInputChange(
                                  certification.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="font-medium mb-2 w-full"
                              placeholder="Certification Name"
                            />
                            <Input
                              type="text"
                              value={certification.issuer}
                              onChange={(e) =>
                                handleInputChange(
                                  certification.id,
                                  "issuer",
                                  e.target.value
                                )
                              }
                              className="text-sm text-muted-foreground mb-2 w-full"
                              placeholder="Issuing Organization"
                            />
                            <div className="flex gap-2 mb-2">
                              <div className="w-1/2">
                                <label className="text-xs text-muted-foreground">
                                  Issue Date
                                </label>
                                <Input
                                  type="date"
                                  value={certification.issueDate}
                                  onChange={(e) =>
                                    handleInputChange(
                                      certification.id,
                                      "issueDate",
                                      e.target.value
                                    )
                                  }
                                  className="text-sm text-muted-foreground"
                                  max={getCurrentDate()}
                                />
                              </div>
                              <div className="w-1/2">
                                <label className="text-xs text-muted-foreground">
                                  Expiration Date
                                </label>
                                <Input
                                  type="date"
                                  value={certification.expirationDate || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      certification.id,
                                      "expirationDate",
                                      e.target.value
                                    )
                                  }
                                  className="text-sm text-muted-foreground"
                                  max={getCurrentDate()}
                                />
                              </div>
                            </div>
                            <Input
                              type="url"
                              value={certification.credentialUrl || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  certification.id,
                                  "credentialUrl",
                                  e.target.value
                                )
                              }
                              className="text-sm text-muted-foreground mb-2 w-full"
                              placeholder="Credential URL"
                            />
                          </>
                        ) : (
                          // Show plain text when not editing
                          <>
                            <h4 className="font-medium">
                              {certification.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {certification.issuer}
                            </p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                              <span>Issued: {certification.issueDate}</span>
                              {certification.expirationDate && (
                                <span>
                                  Expires: {certification.expirationDate}
                                </span>
                              )}
                            </div>
                            {certification.credentialUrl && (
                              <a
                                href={certification.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline mt-1 inline-block"
                              >
                                View Credential
                              </a>
                            )}
                          </>
                        )}
                      </div>

                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 text-red-500"
                          onClick={() =>
                            handleDeleteCertification(
                              certification.id,
                              handleDeleteItem,
                              mutate
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
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
