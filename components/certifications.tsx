"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, Save, Plus, X } from "lucide-react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

interface CertificationsProps {
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Utility function to format date to yyyy-MM-dd for input fields
const formatDateForInput = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Utility function to format date to ISO-8601 format for database
const formatDateForDatabase = (date: string) => {
  const d = new Date(date);
  return d.toISOString(); // Converts to ISO-8601 format
};

// Get current date in YYYY-MM-DD format for date input max attribute
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Certifications({ userId }: CertificationsProps) {
  const [editable, setEditable] = useState(false);
  const [certificationsData, setCertificationsData] = useState<Certification[]>(
    []
  );
  const [editedCertifications, setEditedCertifications] = useState<
    Certification[]
  >([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCertification, setNewCertification] = useState<
    Omit<Certification, "id">
  >({
    name: "",
    issuer: "",
    issueDate: getCurrentDate(),
    expirationDate: "",
    credentialUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>({});

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/certifications`,
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      console.log("Data:", data);
      setCertificationsData(data);

      try {
        // Format dates properly for the edit form
        const formattedData = data.map((cert) => ({
          ...cert,
          issueDate: formatDateForInput(cert.issueDate),
          expirationDate: cert.expirationDate
            ? formatDateForInput(cert.expirationDate)
            : "",
        }));

        setEditedCertifications(formattedData);
      } catch (error) {
        console.error("Error formatting certification dates:", error);
        // Fallback to unformatted data if there's an error
        setEditedCertifications(data);
      }
    }
  }, [data]);

  const handleEditToggle = () => {
    if (editable) {
      saveChanges();
    } else {
      // Make sure dates are properly formatted for editing
      const formattedData = certificationsData.map((cert) => ({
        ...cert,
        issueDate: formatDateForInput(cert.issueDate),
        expirationDate: cert.expirationDate
          ? formatDateForInput(cert.expirationDate)
          : "",
      }));

      setEditedCertifications(formattedData);
    }
    setEditable(!editable);
  };

  const handleInputChange = (
    id: string,
    field: keyof Certification,
    value: string
  ) => {
    setEditedCertifications((prev) =>
      prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  const saveChanges = async () => {
    try {
      setIsSubmitting(true);

      for (const certification of editedCertifications) {
        // Validate required fields
        if (!certification.name.trim()) {
          alert("Certification name is required");
          return;
        }
        if (!certification.issuer.trim()) {
          alert("Issuing organization is required");
          return;
        }
        if (!certification.issueDate) {
          alert("Issue date is required");
          return;
        }

        const payload = {
          name: certification.name.trim(),
          issuer: certification.issuer.trim(),
          issueDate: formatDateForDatabase(certification.issueDate),
          expirationDate:
            certification.expirationDate &&
            certification.expirationDate.trim() !== ""
              ? formatDateForDatabase(certification.expirationDate)
              : null,
          credentialUrl:
            certification.credentialUrl &&
            certification.credentialUrl.trim() !== ""
              ? certification.credentialUrl.trim()
              : null,
        };

        console.log("Updating certification with payload:", payload);

        const response = await fetch(
          `/api/certifications/${certification.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error response:", errorData);
          throw new Error(
            `Failed to update certification: ${
              errorData.error || response.statusText
            }`
          );
        }
      }

      setCertificationsData(editedCertifications);
      setEditable(false);
      mutate(); // Re-fetch data to ensure consistency
    } catch (error) {
      console.error("Error saving changes:", error);
      alert(
        `Error updating certifications: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewCertification({
      name: "",
      issuer: "",
      issueDate: getCurrentDate(),
      expirationDate: "",
      credentialUrl: "",
    });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
  };

  const handleNewCertificationChange = (
    field: keyof Omit<Certification, "id">,
    value: string
  ) => {
    setNewCertification((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      issuer?: string;
      issueDate?: string;
      credentialUrl?: string;
    } = {};
    let isValid = true;

    if (!newCertification.name.trim()) {
      errors.name = "Certification name is required";
      isValid = false;
    }

    if (!newCertification.issuer.trim()) {
      errors.issuer = "Issuing organization is required";
      isValid = false;
    }

    if (!newCertification.issueDate) {
      errors.issueDate = "Issue date is required";
      isValid = false;
    }

    if (
      newCertification.credentialUrl &&
      newCertification.credentialUrl.trim() !== "" &&
      !newCertification.credentialUrl.match(/^https?:\/\/[^\s$.?#].[^\s]*$/)
    ) {
      errors.credentialUrl =
        "Please enter a valid URL (e.g., https://example.com)";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveNewCertification = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form first
    if (!validateForm()) {
      console.log("Form validation failed", formErrors);
      return; // Stop submission if validation fails
    }

    try {
      setIsSubmitting(true);

      // Format dates properly
      const formattedCertification = {
        name: newCertification.name.trim(),
        issuer: newCertification.issuer.trim(),
        issueDate: newCertification.issueDate
          ? new Date(newCertification.issueDate).toISOString()
          : new Date().toISOString(),
        expirationDate:
          newCertification.expirationDate &&
          newCertification.expirationDate.trim() !== ""
            ? new Date(newCertification.expirationDate).toISOString()
            : null,
        credentialUrl:
          newCertification.credentialUrl &&
          newCertification.credentialUrl.trim() !== ""
            ? newCertification.credentialUrl.trim()
            : null,
      };

      console.log("Sending certification data:", formattedCertification);

      const response = await fetch(`/api/users/${userId}/certifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedCertification),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(
          `Failed to add certification: ${
            errorData.error || response.statusText
          }`
        );
      }

      const result = await response.json();
      console.log("API success response:", result);

      // Reset form and refresh data
      setIsAddingNew(false);
      setNewCertification({
        name: "",
        issuer: "",
        issueDate: getCurrentDate(),
        expirationDate: "",
        credentialUrl: "",
      });
      setFormErrors({});

      // Refresh the data
      mutate();
    } catch (error) {
      console.error("Error adding certification:", error);
      alert(
        `Error adding certification: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) {
      return;
    }

    try {
      const response = await fetch(`/api/certifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete certification: ${response.statusText}`
        );
      }

      // Remove from local state and refresh data
      setEditedCertifications(
        editedCertifications.filter((cert) => cert.id !== id)
      );
      mutate();
    } catch (error) {
      console.error("Error deleting certification:", error);
      alert("Failed to delete certification. Please try again.");
    }
  };

  if (isLoading) return <div>Loading certifications...</div>;
  if (error) return <div>Error loading certification information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>

          <div className="flex gap-2">
            {!isAddingNew && !editable && (
              <Button variant="ghost" size="sm" onClick={handleAddNew}>
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              </Button>
            )}

            {editable ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditToggle}
                disabled={isSubmitting}
              >
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Done"}
                </>
              </Button>
            ) : (
              !isAddingNew && (
                <Button variant="ghost" size="sm" onClick={handleEditToggle}>
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
                    value={newCertification.name}
                    onChange={(e) => {
                      handleNewCertificationChange("name", e.target.value);
                      if (formErrors.name) {
                        setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    className={`mt-1 ${
                      formErrors.name ? "border-red-500" : ""
                    }`}
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="text-sm text-muted-foreground">
                    Issuing Organization*
                  </label>
                  <Input
                    value={newCertification.issuer}
                    onChange={(e) => {
                      handleNewCertificationChange("issuer", e.target.value);
                      if (formErrors.issuer) {
                        setFormErrors((prev) => ({
                          ...prev,
                          issuer: undefined,
                        }));
                      }
                    }}
                    className={`mt-1 ${
                      formErrors.issuer ? "border-red-500" : ""
                    }`}
                    placeholder="e.g. Amazon Web Services"
                  />
                  {formErrors.issuer && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.issuer}
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
                      value={newCertification.issueDate}
                      onChange={(e) => {
                        handleNewCertificationChange(
                          "issueDate",
                          e.target.value
                        );
                        if (formErrors.issueDate) {
                          setFormErrors((prev) => ({
                            ...prev,
                            issueDate: undefined,
                          }));
                        }
                      }}
                      className={`mt-1 ${
                        formErrors.issueDate ? "border-red-500" : ""
                      }`}
                      max={getCurrentDate()}
                    />
                    {formErrors.issueDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.issueDate}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label className="text-sm text-muted-foreground">
                      Expiration Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={newCertification.expirationDate || ""}
                      onChange={(e) =>
                        handleNewCertificationChange(
                          "expirationDate",
                          e.target.value
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="text-sm text-muted-foreground">
                    Credential URL (Optional)
                  </label>
                  <Input
                    type="url"
                    value={newCertification.credentialUrl || ""}
                    onChange={(e) => {
                      handleNewCertificationChange(
                        "credentialUrl",
                        e.target.value
                      );
                      if (formErrors.credentialUrl) {
                        setFormErrors((prev) => ({
                          ...prev,
                          credentialUrl: undefined,
                        }));
                      }
                    }}
                    className={`mt-1 ${
                      formErrors.credentialUrl ? "border-red-500" : ""
                    }`}
                    placeholder="https://www.example.com/credential/123"
                  />
                  {formErrors.credentialUrl && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.credentialUrl}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleCancelAdd}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNewCertification}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Certification"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display certifications in edit mode */}
        {editable && certificationsData && certificationsData.length > 0 ? (
          <div className="space-y-4">
            {editedCertifications.map((certification) => (
              <div
                key={certification.id}
                className="flex items-center gap-3 relative"
              >
                <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                  <CheckCircle className="h-4 w-4" />
                </Badge>
                <div className="flex-grow">
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
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 text-red-500"
                  onClick={() => handleDeleteCertification(certification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          // Display certifications in view mode (when not editing and not adding new)
          !isAddingNew &&
          !editable && (
            <>
              {certificationsData && certificationsData.length > 0 ? (
                <div className="space-y-4">
                  {certificationsData.map((certification) => (
                    <div
                      key={certification.id}
                      className="flex items-center gap-3"
                    >
                      <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                        <CheckCircle className="h-4 w-4" />
                      </Badge>
                      <div>
                        <h4 className="font-medium">{certification.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {certification.issuer} · Issued{" "}
                          {new Date(certification.issueDate).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </p>
                        {certification.expirationDate && (
                          <p className="text-sm text-muted-foreground">
                            Expires{" "}
                            {new Date(
                              certification.expirationDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                        {certification.credentialUrl && (
                          <a
                            href={certification.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500"
                          >
                            View Credential
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No certifications added yet. Click "Add" to add your
                  certifications.
                </div>
              )}
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
