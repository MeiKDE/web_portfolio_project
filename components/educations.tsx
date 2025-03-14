/** @jsxImportSource react */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Edit, Save, Plus, X } from "lucide-react";
import useSWR from "swr";
import { z } from "zod";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
  description?: string;
  userId?: string;
}

interface EducationProps {
  userId: string;
}

// Define Zod schema for education validation
const educationSchema = z
  .object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    startYear: z
      .number()
      .int()
      .positive("Start year must be a positive integer"),
    endYear: z
      .number()
      .int()
      .positive("End year must be a positive integer")
      .nullable()
      .optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      // Skip validation if end year is null or empty
      if (data.endYear == null) return true;

      // Compare years - start year should be before or equal to end year
      return data.startYear <= data.endYear;
    },
    {
      message: "Start year cannot be after end year",
      path: ["startYear", "endYear"],
    }
  );

// Update ValidationErrors interface to handle Zod validation
interface ValidationErrors {
  [key: string]: { [field: string]: boolean } | z.ZodIssue[];
}

// Improved fetcher function with error handling
const fetcher = async (url: string) => {
  console.log("Fetching from URL:", url);
  try {
    const response = await fetch(url, {
      credentials: "include",
    });

    console.log("Response status:", response.status);

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
        const errorData = await response.json();
        console.error("API error details:", errorData);
        (error as any).info = errorData;
      } catch (e) {
        // If parsing fails, just use the status text
        (error as any).info = response.statusText;
      }

      throw error;
    }

    const responseData = await response.json();
    console.log("API response data:", responseData);
    return responseData;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default function Educations({ userId }: EducationProps) {
  const [editable, setEditable] = useState(false);
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [editedEducation, setEditedEducation] = useState<Education[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add state for validation errors
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/education`,
    fetcher,
    {
      onError: (err) => {
        console.error("Error fetching education:", err);
        // You can set a more user-friendly error message here if needed

        // If unauthorized, you might want to redirect to login
        if (err.status === 401) {
          // Redirect to login or show auth error
          // window.location.href = "/login";
        }
      },
      // Add retry configuration if needed
      // retry: 3,
    }
  );

  // Update local state when data is fetched
  useEffect(() => {
    console.log("Education data from API:", data);

    // Check if data exists and has the expected structure
    if (data && !data.error && Array.isArray(data.data)) {
      // Use data.data instead of data directly
      setEducationData(data.data);
      setEditedEducation(JSON.parse(JSON.stringify(data.data))); // Deep copy for editing
    } else if (data && Array.isArray(data)) {
      // Handle case where data might be directly an array (for backward compatibility)
      setEducationData(data);
      setEditedEducation(JSON.parse(JSON.stringify(data)));
    } else {
      // Initialize with empty arrays if data is not available or in unexpected format
      console.log("Initializing with empty arrays - data format unexpected");
      setEducationData([]);
      setEditedEducation([]);
    }

    console.log("Current educationData state:", educationData);
    console.log("Current editedEducation state:", editedEducation);
  }, [data]);

  // Update validation function to use Zod
  const validateEducation = (education: Education, id: string) => {
    try {
      // Validate with Zod schema
      educationSchema.parse(education);

      // If validation passes, clear any existing errors
      setValidationErrors((prev) => ({
        ...prev,
        [id]: [],
      }));

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Store Zod validation issues
        setValidationErrors((prev) => ({
          ...prev,
          [id]: error.issues,
        }));
        return false;
      }
      return false;
    }
  };

  const handleEditToggle = () => {
    if (editable) {
      // Validate all education entries before saving
      let hasErrors = false;

      editedEducation.forEach((edu) => {
        if (!validateEducation(edu, edu.id)) {
          hasErrors = true;
        }
      });

      if (hasErrors) {
        alert("Please fill out all required fields before saving.");
        return;
      }

      saveChanges();
    } else {
      // Reset validation errors when entering edit mode
      setValidationErrors({});
    }
    setEditable(!editable);
  };

  // Add helper functions for validation errors
  const getFieldError = (id: string, field: string): string | null => {
    if (!validationErrors[id]) return null;

    if (Array.isArray(validationErrors[id])) {
      const issues = validationErrors[id] as z.ZodIssue[];
      const issue = issues.find((i) => i.path.includes(field));
      return issue ? issue.message : null;
    } else {
      const errors = validationErrors[id] as { [field: string]: boolean };
      return errors[field]
        ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        : null;
    }
  };

  // Add a function to check if a field has a date relationship error
  const hasYearRangeError = (id: string): boolean => {
    if (!validationErrors[id] || !Array.isArray(validationErrors[id]))
      return false;

    const issues = validationErrors[id] as z.ZodIssue[];
    return issues.some(
      (issue) =>
        issue.path.includes("startYear") && issue.path.includes("endYear")
    );
  };

  // Add a function to get the year range error message
  const getYearRangeError = (id: string): string | null => {
    if (!validationErrors[id] || !Array.isArray(validationErrors[id]))
      return null;

    const issues = validationErrors[id] as z.ZodIssue[];
    const issue = issues.find(
      (issue) =>
        issue.path.includes("startYear") && issue.path.includes("endYear")
    );

    return issue ? issue.message : null;
  };

  const handleInputChange = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    if (field === "startYear" || field === "endYear") {
      // Convert string input to number for year fields
      const numValue = value === "" ? null : parseInt(value, 10);

      setEditedEducation((prev) =>
        prev.map((edu) => (edu.id === id ? { ...edu, [field]: numValue } : edu))
      );
    } else {
      // Handle other fields normally
      setEditedEducation((prev) =>
        prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
      );
    }

    // If changing years, validate the year relationship
    if (field === "startYear" || field === "endYear") {
      const education = editedEducation.find((edu) => edu.id === id);
      if (education) {
        const updatedEducation = {
          ...education,
          [field]:
            field === "startYear" || field === "endYear"
              ? value === ""
                ? null
                : parseInt(value, 10)
              : value,
        };

        // Only validate if we have both years
        if (
          updatedEducation.startYear != null &&
          updatedEducation.endYear != null
        ) {
          const isValid =
            updatedEducation.startYear <= updatedEducation.endYear;

          // Update validation errors based on year comparison
          if (!isValid) {
            setValidationErrors((prev) => ({
              ...prev,
              [id]: Array.isArray(prev[id])
                ? [
                    ...(prev[id] as z.ZodIssue[]).filter(
                      (issue) =>
                        !issue.path.includes("startYear") &&
                        !issue.path.includes("endYear")
                    ),
                    {
                      code: "custom",
                      path: ["startYear", "endYear"],
                      message: "Start year cannot be after end year",
                    },
                  ]
                : [
                    {
                      code: "custom",
                      path: ["startYear", "endYear"],
                      message: "Start year cannot be after end year",
                    },
                  ],
            }));
          } else {
            // Clear year relationship errors if valid
            setValidationErrors((prev) => {
              if (!Array.isArray(prev[id])) return prev;

              return {
                ...prev,
                [id]: (prev[id] as z.ZodIssue[]).filter(
                  (issue) =>
                    !(
                      issue.path.includes("startYear") &&
                      issue.path.includes("endYear")
                    )
                ),
              };
            });
          }
        }
      }
    }

    // Clear individual field validation errors
    if (validationErrors[id]) {
      // If using Zod issues array
      if (Array.isArray(validationErrors[id])) {
        const issues = validationErrors[id] as z.ZodIssue[];
        const updatedIssues = issues.filter(
          (issue) =>
            !issue.path.includes(field as string) ||
            (issue.path.length > 1 &&
              issue.path.includes("startYear") &&
              issue.path.includes("endYear"))
        );

        setValidationErrors((prev) => ({
          ...prev,
          [id]: updatedIssues,
        }));
      } else {
        // For backward compatibility with the old validation format
        const errors = validationErrors[id] as { [field: string]: boolean };
        if (errors[field as string]) {
          setValidationErrors((prev) => ({
            ...prev,
            [id]: {
              ...(prev[id] as { [field: string]: boolean }),
              [field]: false,
            },
          }));
        }
      }
    }
  };

  const handleAddEducation = () => {
    // Create a temporary ID for the new education entry
    const tempId = `temp-${Date.now()}`;

    // Create a new education entry with default values
    const newEducation: Education = {
      id: tempId,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 4,
      description: "",
    };

    // Add the new education to the edited list
    setEditedEducation((prev) =>
      Array.isArray(prev) ? [...prev, newEducation] : [newEducation]
    );

    // Enable editing mode if not already enabled
    if (!editable) {
      setEditable(true);
    }
  };

  const handleCancelAdd = () => {
    // If we're adding a new entry, remove it and exit edit mode
    if (editedEducation.length > educationData.length) {
      setEditedEducation(JSON.parse(JSON.stringify(educationData)));
    }
    setEditable(false);
  };

  const handleSaveNewEducation = async () => {
    // Validate the new education entry
    const newEntry = editedEducation[editedEducation.length - 1];
    if (!validateEducation(newEntry, newEntry.id)) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Format the payload - convert string years to integers
      const payload = {
        institution: newEntry.institution,
        degree: newEntry.degree,
        fieldOfStudy: newEntry.fieldOfStudy,
        startYear: newEntry.startYear,
        endYear: newEntry.endYear ? newEntry.endYear : null,
        description: newEntry.description || "",
      };

      console.log("Sending new education payload:", payload);

      const response = await fetch(`/api/users/${userId}/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to add education: ${response.statusText}. ${JSON.stringify(
            errorData
          )}`
        );
      }

      // Refresh the data
      mutate();
      setEditable(false);
    } catch (error) {
      console.error("Error adding education:", error);
      alert("Failed to add education. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveChanges = async () => {
    try {
      setIsSubmitting(true);

      for (const education of editedEducation) {
        // Skip empty entries
        if (
          !education.institution ||
          !education.degree ||
          !education.fieldOfStudy
        ) {
          console.log("Skipping empty education entry:", education);
          continue;
        }

        console.log("Processing education:", education);

        // Create a modified payload with startYear and endYear converted to integer
        const payload = {
          institution: education.institution,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          startYear: education.startYear,
          endYear: education.endYear ? education.endYear : null,
          description: education.description || "",
        };

        console.log("Sending payload:", payload);

        // Check if this is a new entry (has a temp ID)
        const isNewEntry = education.id.startsWith("temp-");

        if (isNewEntry) {
          // Create a new education entry
          console.log("Creating new education entry:", payload);
          const response = await fetch(`/api/users/${userId}/education`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Error response:", errorData);
            throw new Error(
              `Failed to create education: ${
                response.statusText
              }. ${JSON.stringify(errorData)}`
            );
          }
        } else {
          // Update existing education entry
          console.log("Updating education:", payload);
          const response = await fetch(
            `/api/users/${userId}/education/${education.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Error response:", errorData);
            throw new Error(
              `Failed to update education: ${
                response.statusText
              }. ${JSON.stringify(errorData)}`
            );
          }
        }
      }

      // Re-fetch data to ensure consistency
      mutate();
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    try {
      // If it's a temporary ID (new unsaved entry), just remove it from state
      if (id.startsWith("temp-")) {
        setEditedEducation(editedEducation.filter((edu) => edu.id !== id));
        return;
      }

      const response = await fetch(`/api/users/${userId}/education/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete education: ${response.statusText}`);
      }

      // Remove from local state and refresh data
      setEditedEducation(editedEducation.filter((edu) => edu.id !== id));
      mutate();
    } catch (error) {
      console.error("Error deleting education:", error);
      alert("Failed to delete education. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Education data from API:", data);
    console.log("Current educationData state:", educationData);
    console.log("Current editedEducation state:", editedEducation);
  }, [data, educationData, editedEducation]);

  if (isLoading) {
    return <LoadingSpinner size="sm" text="Loading education..." />;
  }
  if (error) return <div>Error loading education information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Education
          </h3>
          <div className="flex gap-2">
            {!editable ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleAddEducation}>
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleEditToggle}>
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                </Button>
              </>
            ) : (
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
            )}
          </div>
        </div>

        {/* Display the most recently added education entry with Save/Cancel buttons */}
        {editable && editedEducation.length > educationData.length ? (
          <div className="mb-6 border-b pb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {editedEducation[editedEducation.length - 1].institution
                      .substring(0, 2)
                      .toUpperCase() || "ED"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                <div className="mb-2">
                  <input
                    type="text"
                    value={
                      editedEducation[editedEducation.length - 1].institution
                    }
                    onChange={(e) =>
                      handleInputChange(
                        editedEducation[editedEducation.length - 1].id,
                        "institution",
                        e.target.value
                      )
                    }
                    className={`font-semibold w-full p-1 border rounded ${
                      getFieldError(
                        editedEducation[editedEducation.length - 1].id,
                        "institution"
                      )
                        ? "border-red-500 ring-red-500"
                        : ""
                    }`}
                    placeholder="Institution*"
                  />
                  {getFieldError(
                    editedEducation[editedEducation.length - 1].id,
                    "institution"
                  ) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError(
                        editedEducation[editedEducation.length - 1].id,
                        "institution"
                      )}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    value={editedEducation[editedEducation.length - 1].degree}
                    onChange={(e) =>
                      handleInputChange(
                        editedEducation[editedEducation.length - 1].id,
                        "degree",
                        e.target.value
                      )
                    }
                    className={`text-muted-foreground w-full p-1 border rounded ${
                      getFieldError(
                        editedEducation[editedEducation.length - 1].id,
                        "degree"
                      )
                        ? "border-red-500 ring-red-500"
                        : ""
                    }`}
                    placeholder="Degree*"
                  />
                  {getFieldError(
                    editedEducation[editedEducation.length - 1].id,
                    "degree"
                  ) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError(
                        editedEducation[editedEducation.length - 1].id,
                        "degree"
                      )}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    value={
                      editedEducation[editedEducation.length - 1].fieldOfStudy
                    }
                    onChange={(e) =>
                      handleInputChange(
                        editedEducation[editedEducation.length - 1].id,
                        "fieldOfStudy",
                        e.target.value
                      )
                    }
                    className={`text-muted-foreground w-full p-1 border rounded ${
                      getFieldError(
                        editedEducation[editedEducation.length - 1].id,
                        "fieldOfStudy"
                      )
                        ? "border-red-500 ring-red-500"
                        : ""
                    }`}
                    placeholder="Field of Study*"
                  />
                  {getFieldError(
                    editedEducation[editedEducation.length - 1].id,
                    "fieldOfStudy"
                  ) && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError(
                        editedEducation[editedEducation.length - 1].id,
                        "fieldOfStudy"
                      )}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mb-2">
                  <div className="w-1/2">
                    <input
                      type="number"
                      value={
                        editedEducation[editedEducation.length - 1].startYear ||
                        ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          editedEducation[editedEducation.length - 1].id,
                          "startYear",
                          e.target.value
                        )
                      }
                      className={`text-sm text-muted-foreground w-full p-1 border rounded ${
                        getFieldError(
                          editedEducation[editedEducation.length - 1].id,
                          "startYear"
                        ) ||
                        hasYearRangeError(
                          editedEducation[editedEducation.length - 1].id
                        )
                          ? "border-red-500 ring-red-500"
                          : ""
                      }`}
                      placeholder="Start Year*"
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="number"
                      value={
                        editedEducation[editedEducation.length - 1].endYear ||
                        ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          editedEducation[editedEducation.length - 1].id,
                          "endYear",
                          e.target.value
                        )
                      }
                      className={`text-sm text-muted-foreground w-full p-1 border rounded ${
                        hasYearRangeError(
                          editedEducation[editedEducation.length - 1].id
                        )
                          ? "border-red-500 ring-red-500"
                          : ""
                      }`}
                      placeholder="End Year"
                    />
                  </div>
                </div>

                {hasYearRangeError(
                  editedEducation[editedEducation.length - 1].id
                ) && (
                  <p className="text-red-500 text-xs mt-1 mb-2">
                    {getYearRangeError(
                      editedEducation[editedEducation.length - 1].id
                    )}
                  </p>
                )}

                <textarea
                  value={
                    editedEducation[editedEducation.length - 1].description ||
                    ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      editedEducation[editedEducation.length - 1].id,
                      "description",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full p-1 border rounded"
                  rows={4}
                  placeholder="Description (optional)"
                />

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleCancelAdd}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveNewEducation}>
                    Save Education
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Display existing education entries only when not adding a new entry */
          <>
            {(editable
              ? editedEducation.slice(0, educationData.length)
              : educationData
            ).length > 0 ? (
              (editable
                ? editedEducation.slice(0, educationData.length)
                : educationData
              ).map((edu, index) => (
                <div
                  key={edu.id}
                  className="flex flex-col sm:flex-row gap-4 mb-6 relative border-b pb-4 last:border-b-0"
                >
                  {editable && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 text-red-500"
                      onClick={() => handleDeleteEducation(edu.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={"/placeholder.svg?height=48&width=48"}
                        alt="University logo"
                      />
                      <AvatarFallback>
                        {edu.institution
                          ? edu.institution.substring(0, 2).toUpperCase()
                          : "ED"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-grow">
                    {editable ? (
                      <>
                        <div className="mb-2">
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) =>
                              handleInputChange(
                                edu.id,
                                "institution",
                                e.target.value
                              )
                            }
                            className={`font-semibold w-full p-1 border rounded ${
                              getFieldError(edu.id, "institution")
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                            placeholder="Institution*"
                          />
                          {getFieldError(edu.id, "institution") && (
                            <p className="text-red-500 text-xs mt-1">
                              {getFieldError(edu.id, "institution")}
                            </p>
                          )}
                        </div>

                        <div className="mb-2">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              handleInputChange(
                                edu.id,
                                "degree",
                                e.target.value
                              )
                            }
                            className={`text-muted-foreground w-full p-1 border rounded ${
                              getFieldError(edu.id, "degree")
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                            placeholder="Degree*"
                          />
                          {getFieldError(edu.id, "degree") && (
                            <p className="text-red-500 text-xs mt-1">
                              {getFieldError(edu.id, "degree")}
                            </p>
                          )}
                        </div>

                        <div className="mb-2">
                          <input
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) =>
                              handleInputChange(
                                edu.id,
                                "fieldOfStudy",
                                e.target.value
                              )
                            }
                            className={`text-muted-foreground w-full p-1 border rounded ${
                              getFieldError(edu.id, "fieldOfStudy")
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                            placeholder="Field of Study*"
                          />
                          {getFieldError(edu.id, "fieldOfStudy") && (
                            <p className="text-red-500 text-xs mt-1">
                              {getFieldError(edu.id, "fieldOfStudy")}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 mb-2">
                          <div className="w-1/2">
                            <input
                              type="number"
                              value={edu.startYear || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  edu.id,
                                  "startYear",
                                  e.target.value
                                )
                              }
                              className={`text-sm text-muted-foreground w-full p-1 border rounded ${
                                getFieldError(edu.id, "startYear") ||
                                hasYearRangeError(edu.id)
                                  ? "border-red-500 ring-red-500"
                                  : ""
                              }`}
                              placeholder="Start Year*"
                            />
                            {getFieldError(edu.id, "startYear") && (
                              <p className="text-red-500 text-xs mt-1">
                                {getFieldError(edu.id, "startYear")}
                              </p>
                            )}
                          </div>
                          <div className="w-1/2">
                            <input
                              type="number"
                              value={edu.endYear || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  edu.id,
                                  "endYear",
                                  e.target.value
                                )
                              }
                              className={`text-sm text-muted-foreground w-full p-1 border rounded ${
                                hasYearRangeError(edu.id)
                                  ? "border-red-500 ring-red-500"
                                  : ""
                              }`}
                              placeholder="End Year"
                            />
                          </div>
                        </div>

                        {hasYearRangeError(edu.id) && (
                          <p className="text-red-500 text-xs mt-1 mb-2">
                            {getYearRangeError(edu.id)}
                          </p>
                        )}

                        <textarea
                          value={edu.description || ""}
                          onChange={(e) =>
                            handleInputChange(
                              edu.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="mt-2 w-full p-1 border rounded"
                          rows={4}
                          placeholder="Description (optional)"
                        />
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold">{edu.institution}</h4>
                        <p className="text-muted-foreground">
                          {edu.degree} in {edu.fieldOfStudy}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {edu.startYear}
                          {edu.endYear ? ` - ${edu.endYear}` : ""}
                        </p>
                        {edu.description && (
                          <p className="mt-2">{edu.description}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No education information available. Click "Add" to add your
                education history.
              </div>
            )}
          </>
        )}

        {/* Add a note about required fields */}
        {editable && (
          <div className="text-sm text-muted-foreground mt-4">
            * Required fields
          </div>
        )}
      </CardContent>
    </Card>
  );
}
