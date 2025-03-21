"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, Save, Plus, X } from "lucide-react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";

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

// Improved fetcher function with error handling
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include",
  });

  // Check if the request was successful
  if (!response.ok) {
    // Create an error object with details from the response
    const error = new Error(
      `An error occurred while fetching the data: ${response.statusText}`
    );
    // Add status and info from response to the error
    (error as any).status = response.status;

    // Try to parse error details if available
    try {
      (error as any).info = await response.json();
    } catch (e) {
      // If parsing fails, just use the status text
      (error as any).info = response.statusText;
    }

    throw error;
  }

  // For debugging
  console.log("Response status:", response.status);

  return response.json();
};

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

// Zod schema for certification form validation
const certificationFormSchema = z
  .object({
    name: z.string().min(1, "Certification name is required"),
    issuer: z.string().min(1, "Issuing organization is required"),
    issueDate: z.string().refine((val) => {
      // Check if it's a valid date in YYYY-MM-DD format
      return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(new Date(val).getTime());
    }, "Please enter a valid issue date"),
    expirationDate: z
      .string()
      .optional()
      .refine((val) => {
        // If empty string, it's valid (no expiration)
        if (!val || val.trim() === "") return true;

        // Otherwise check if it's a valid date in YYYY-MM-DD format
        return (
          /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(new Date(val).getTime())
        );
      }, "Please enter a valid expiration date"),
    credentialUrl: z
      .string()
      .optional()
      .refine((val) => {
        // If empty string, it's valid (no URL)
        if (!val || val.trim() === "") return true;

        // Otherwise check if it's a valid URL
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }, "Please enter a valid URL"),
  })
  .refine(
    (data) => {
      // Skip validation if expiration date is empty
      if (!data.expirationDate || data.expirationDate.trim() === "")
        return true;

      // Check that issue date is not after expiration date
      const issueDate = new Date(data.issueDate);
      const expirationDate = new Date(data.expirationDate);
      return issueDate <= expirationDate;
    },
    {
      message: "Issue date cannot be after expiration date",
      path: ["expirationDate"],
    }
  );

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
    Omit<Certification, "id"> //this means id is not required
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
  const [newCertificationErrors, setNewCertificationErrors] = useState<{
    [key: string]: string | null;
  }>({});

  // Use the form validation hook
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  } = useFormValidation(newCertification, {
    name: (value) => (!value ? "Name is required" : null),
    issuer: (value) => (!value ? "Issuer is required" : null),
    issueDate: (value) => (!value ? "Issue date is required" : null),
    expirationDate: () => null, // optional
    credentialUrl: () => null, // optional
  });

  // GET all certifications for a user
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/certifications`,
    fetcher,
    {
      onError: (err) => {
        console.error("Error fetching certifications:", err);

        // If unauthorized, you might want to redirect to login
        if (err.status === 401) {
          // Redirect to login or show auth error
          // window.location.href = "/login";
        }
      },
    }
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      console.log("ln89: Raw certification data received:", data);

      // Handle different response formats
      let certifications;

      if (Array.isArray(data)) {
        certifications = data;
      } else if (data.certifications && Array.isArray(data.certifications)) {
        certifications = data.certifications;
      } else if (typeof data === "object") {
        // If it's a success response object with data property
        certifications = data.data && Array.isArray(data.data) ? data.data : [];
      } else {
        certifications = [];
        console.error("Unexpected data format:", data);
      }

      console.log("Processed certifications:", certifications);

      setCertificationsData(certifications);

      try {
        // Format dates properly for the edit form
        const formattedData = certifications.map((cert: Certification) => ({
          ...cert,
          issueDate: cert.issueDate
            ? formatDateForInput(cert.issueDate)
            : getCurrentDate(),
          expirationDate: cert.expirationDate
            ? formatDateForInput(cert.expirationDate)
            : "",
        }));

        setEditedCertifications(formattedData);
      } catch (error: unknown) {
        console.error(
          "Error formatting certification dates:",
          error instanceof Error ? error.message : String(error)
        );
        // Fallback to unformatted data if there's an error
        setEditedCertifications(certifications);
      }
    }
  }, [data]);

  const handleEditToggle = () => {
    console.log("ln247: handleEditToggle function called");
    if (editable) {
      console.log("ln249: editable is true");
      saveChanges();
    } else {
      console.log("ln252: editable is false");
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

  const validateEditedCertifications = () => {
    console.log("ln278: validateEditedCertifications function called");
    const errors: Record<string, { field: string; message: string }[]> = {};

    for (const cert of editedCertifications) {
      const certErrors: { field: string; message: string }[] = [];

      // Check required fields
      if (!cert.name.trim()) {
        certErrors.push({ field: "name", message: "Name is required" });
      }

      if (!cert.issuer.trim()) {
        certErrors.push({ field: "issuer", message: "Issuer is required" });
      }

      // Check date format and validity
      if (
        !cert.issueDate ||
        !/^\d{4}-\d{2}-\d{2}$/.test(cert.issueDate) ||
        isNaN(new Date(cert.issueDate).getTime())
      ) {
        certErrors.push({
          field: "issueDate",
          message: "Valid issue date is required",
        });
      }

      // Check expiration date if provided
      if (cert.expirationDate && cert.expirationDate.trim() !== "") {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(cert.expirationDate) ||
          isNaN(new Date(cert.expirationDate).getTime())
        ) {
          certErrors.push({
            field: "expirationDate",
            message: "Invalid expiration date format",
          });
        } else {
          // Check that issue date is not after expiration date
          const issueDate = new Date(cert.issueDate);
          const expirationDate = new Date(cert.expirationDate);
          if (issueDate > expirationDate) {
            certErrors.push({
              field: "expirationDate",
              message: "Issue date cannot be after expiration date",
            });
          }
        }
      }

      // Check URL format if provided
      if (cert.credentialUrl && cert.credentialUrl.trim() !== "") {
        try {
          new URL(cert.credentialUrl);
        } catch {
          certErrors.push({
            field: "credentialUrl",
            message: "Invalid URL format",
          });
        }
      }

      if (certErrors.length > 0) {
        errors[cert.id] = certErrors;
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const saveChanges = async () => {
    console.log("ln256: saveChanges function called");
    try {
      const validationErrors = validateEditedCertifications();
      if (validationErrors) {
        console.error("Validation errors:", validationErrors);
        alert("Please fix the validation errors before saving");
        return;
      }

      setIsSubmitting(true);

      for (const certification of editedCertifications) {
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

    // Mark field as touched and validate
    handleBlur(field);
    validateForm();
  };

  const handleSaveNewCertification = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const errors: { [key: string]: string | null } = {};
    if (!newCertification.name) {
      errors.name = "Certification Name is required.";
    }
    if (!newCertification.issuer) {
      errors.issuer = "Issuing Organization is required.";
    }
    if (!newCertification.issueDate) {
      errors.issueDate = "Issue Date is required.";
    }

    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setNewCertificationErrors(errors);
      return;
    }

    // Proceed with saving the new certification if no errors
    try {
      setIsSubmitting(true);

      // Format dates properly for the API
      const formattedCertification = {
        name: newCertification.name.trim(),
        issuer: newCertification.issuer.trim(),
        issueDate: formatDateForDatabase(newCertification.issueDate),
        expirationDate:
          newCertification.expirationDate &&
          newCertification.expirationDate.trim() !== ""
            ? formatDateForDatabase(newCertification.expirationDate)
            : null,
        credentialUrl:
          newCertification.credentialUrl &&
          newCertification.credentialUrl.trim() !== ""
            ? newCertification.credentialUrl.trim()
            : null,
      };
      // POST is create new certification
      console.log(
        "ln484: check formattedCertification",
        formattedCertification
      );
      const response = await fetch(`/api/certifications/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedCertification),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add certification: ${
            errorData.error || response.statusText
          }`
        );
      }

      // Reset form and refresh data
      setIsAddingNew(false);
      setNewCertification({
        name: "",
        issuer: "",
        issueDate: getCurrentDate(),
        expirationDate: "",
        credentialUrl: "",
      });
      setNewCertificationErrors({}); // Clear errors

      // Refresh the data
      mutate();
    } catch (error) {
      console.error("Error adding certification:", error);
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
                    onChange={(e) =>
                      handleNewCertificationChange("name", e.target.value)
                    }
                    className={`mt-1 ${
                      newCertificationErrors.name ? "border-red-500" : ""
                    }`}
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                  {newCertificationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {newCertificationErrors.name}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="text-sm text-muted-foreground">
                    Issuing Organization*
                  </label>
                  <Input
                    value={newCertification.issuer}
                    onChange={(e) =>
                      handleNewCertificationChange("issuer", e.target.value)
                    }
                    className={`mt-1 ${
                      newCertificationErrors.issuer ? "border-red-500" : ""
                    }`}
                    placeholder="e.g. Amazon Web Services"
                  />
                  {newCertificationErrors.issuer && (
                    <p className="text-red-500 text-xs mt-1">
                      {newCertificationErrors.issuer}
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
                      onChange={(e) =>
                        handleNewCertificationChange(
                          "issueDate",
                          e.target.value
                        )
                      }
                      className={`mt-1 ${
                        newCertificationErrors.issueDate ? "border-red-500" : ""
                      }`}
                      max={getCurrentDate()}
                    />
                    {newCertificationErrors.issueDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {newCertificationErrors.issueDate}
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
                    value={newCertification.credentialUrl || ""}
                    onChange={(e) =>
                      handleNewCertificationChange(
                        "credentialUrl",
                        e.target.value
                      )
                    }
                    className="mt-1"
                    placeholder="https://www.example.com/credential/123"
                  />
                  {newCertificationErrors.credentialUrl && (
                    <p className="text-red-500 text-xs mt-1">
                      {newCertificationErrors.credentialUrl}
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
