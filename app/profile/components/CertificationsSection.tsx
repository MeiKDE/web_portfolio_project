"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, Save, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import {
  formatDateForDatabase,
  getCurrentDate,
  formatCertificationsForUI,
} from "@/app/hooks/date-utils";
import { useEditableState } from "@/app/hooks/form/use-editable-state";
import { handleCancelAdd } from "./certificates/HandleCancelAdd";
import { Certification } from "./certificates/Interface";
import { handleNewCertificationChange } from "./certificates/HandleNewCertificationChange";
import { handleSaveNewCertification } from "./certificates/HandleSaveNewCertification";
import { handleDeleteCertification } from "./certificates/HandleDeleteCertification";
import { handleSaveCertifications } from "./certificates/HandleSaveCertifications";

interface CertificationsProps {
  userId: string;
}

// This function is used to display the certifications section in the profile page
export default function Certifications({ userId }: CertificationsProps) {
  // this is the hook that is used to handle the editable STATE of the certifications section
  const {
    isEditing,
    isAddingNew,
    editedData,
    isSubmitting,
    saveSuccess,
    newItemData,
    newItemErrors,
    setIsEditing,
    setIsAddingNew,
    setEditedData,
    setIsSubmitting,
    setSaveSuccess,
    setNewItemData,
    setNewItemErrors,
    startEditing,
    cancelEditing,
    startAddingNew,
    cancelAddingNew,
    handleNewItemChange,
    validateNewItem,
    handleInputChange,
    handleSaveNewItem,
    handleDeleteItem,
    handleSaveEdits,
  } = useEditableState<Certification[]>([]);

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

  // // This function is for real-time form input handling CHANGE
  // // Called: On every input change in the form fields
  // const handleNewCertificationChange = (
  //   field: keyof Omit<Certification, "id">,
  //   value: string
  // ) => {
  //   handleNewItemChange(field, value);
  // };

  // // This function is used to SAVE a new certification
  // // Creating New certifications
  // // Called when saving the Add New Certification form
  // const handleSaveNewCertification = (e: React.FormEvent) => {
  //   handleSaveNewItem({
  //     event: e,
  //     requiredFields: ["name", "issuer", "issueDate"],
  //     formatData: (data) => ({
  //       name: data?.name?.trim(),
  //       issuer: data?.issuer?.trim(),
  //       issueDate: data?.issueDate
  //         ? formatDateForDatabase(data.issueDate as string)
  //         : "",
  //       expirationDate:
  //         data?.expirationDate && (data.expirationDate as string).trim() !== ""
  //           ? formatDateForDatabase(data.expirationDate as string)
  //           : null,
  //       credentialUrl:
  //         data?.credentialUrl && (data.credentialUrl as string).trim() !== ""
  //           ? (data.credentialUrl as string).trim()
  //           : null,
  //     }),
  //     endpoint: "/api/certifications/",
  //     onSuccess: () => mutate(), // Refresh data on success
  //     onError: (error) => console.error("Error adding certification:", error),
  //   });
  // };

  // // DELETE certification
  // const handleDeleteCertification = (id: string) => {
  //   handleDeleteItem({
  //     id,
  //     confirmMessage: "Are you sure you want to delete this certification?",
  //     endpoint: `/api/certifications/${id}`,
  //     filterFn: (cert) => cert.id !== id,
  //     onSuccess: () => {
  //       mutate();
  //     },
  //     onError: (error) => {
  //       console.error("Error deleting certification:", error);
  //       alert("Failed to delete certification. Please try again.");
  //     },
  //   });
  // };

  // SAVE all edited certifications to the backend
  // Updating existing ones
  // Called when clicking the "Done" button in edit mode
  // const handleSaveCertifications = () => {
  //   handleSaveEdits({
  //     endpoint: "/api/certifications",
  //     dateFields: ["issueDate", "expirationDate"],
  //     onSuccess: () => mutate(),
  //     onError: (error) => {
  //       console.error("Error saving certifications:", error);
  //       alert("Failed to save certifications. Please try again.");
  //     },
  //   });
  // };

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
          <div className="mb-6 border-b pb-6">
            <div className="flex flex-col gap-4">
              <div className="flex-grow">
                <div className="mb-2">
                  <label className="text-sm text-muted-foreground">
                    Certification Name*
                  </label>
                  <Input
                    value={newItemData?.name || ""}
                    onChange={(e) =>
                      handleNewCertificationChange(
                        "name",
                        e.target.value,
                        handleNewItemChange
                      )
                    }
                    className={`mt-1 ${
                      newItemErrors.name ? "border-red-500" : ""
                    }`}
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                  {newItemErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {newItemErrors.name}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="text-sm text-muted-foreground">
                    Issuing Organization*
                  </label>
                  <Input
                    value={newItemData?.issuer || ""}
                    onChange={(e) =>
                      handleNewCertificationChange(
                        "issuer",
                        e.target.value,
                        handleNewItemChange
                      )
                    }
                    className={`mt-1 ${
                      newItemErrors.issuer ? "border-red-500" : ""
                    }`}
                    placeholder="e.g. Amazon Web Services"
                  />
                  {newItemErrors.issuer && (
                    <p className="text-red-500 text-xs mt-1">
                      {newItemErrors.issuer}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mb-2">
                  <div className="w-1/2">
                    <label className="text-sm text-muted-foreground">
                      Issue Date*
                    </label>
                    <Input
                      type="date"
                      value={newItemData?.issueDate || ""}
                      onChange={(e) =>
                        handleNewCertificationChange(
                          "issueDate",
                          e.target.value,
                          handleNewItemChange
                        )
                      }
                      className={`mt-1 ${
                        newItemErrors.issueDate ? "border-red-500" : ""
                      }`}
                      max={getCurrentDate()}
                    />
                    {newItemErrors.issueDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {newItemErrors.issueDate}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label className="text-sm text-muted-foreground">
                      Expiration Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={newItemData?.expirationDate || ""}
                      onChange={(e) =>
                        handleNewCertificationChange(
                          "expirationDate",
                          e.target.value,
                          handleNewItemChange
                        )
                      }
                      className="mt-1"
                      max={getCurrentDate()}
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="text-sm text-muted-foreground">
                    Credential URL (Optional)
                  </label>
                  <Input
                    type="url"
                    value={newItemData?.credentialUrl || ""}
                    onChange={(e) =>
                      handleNewCertificationChange(
                        "credentialUrl",
                        e.target.value,
                        handleNewItemChange
                      )
                    }
                    className="mt-1"
                    placeholder="https://www.example.com/credential/123"
                  />
                  {newItemErrors.credentialUrl && (
                    <p className="text-red-500 text-xs mt-1">
                      {newItemErrors.credentialUrl}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelAdd(cancelAddingNew)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) =>
                      handleSaveNewCertification(
                        e,
                        handleSaveNewItem,
                        formatDateForDatabase,
                        mutate
                      )
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Certification"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
