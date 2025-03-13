"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Edit,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  X,
  Save,
  Plus,
} from "lucide-react";
import useSWR from "swr";
import { z } from "zod"; // Import zod for validation

// Define Zod schema for experience validation
const experienceSchema = z
  .object({
    position: z.string().min(1, "Position is required"),
    company: z.string().min(1, "Company is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().nullable(),
    description: z.string().optional(),
    location: z.string().optional(),
    isCurrentPosition: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Skip validation if end date is null or empty (current position)
      if (!data.endDate || data.isCurrentPosition) return true;

      // Compare dates - start date should be before or equal to end date
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate <= endDate;
    },
    {
      message: "Start date cannot be after end date",
      path: ["startDate", "endDate"], // This will mark both fields as having an error
    }
  );

interface Experience {
  id: string;
  position: string; // Changed from title to position
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
  location: string;
  isCurrentPosition: boolean;
}

//Defines the props for the Experience component, which includes a userId.
interface ExperienceProps {
  userId: string;
}

//A utility function fetcher is defined to fetch data from a given URL and parse it as JSON.
const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

// Update the date formatting utility to show only month and year
const formatDateForDisplay = (isoDate: string) => {
  const date = new Date(isoDate);
  // Format as "Month Year" (e.g., "Feb 2023")
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// Keep the existing formatDateForInput function for the date input fields
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

// Add a function to handle date relationship validation in the UI
const validateDateRange = (
  startDate: string,
  endDate: string | null,
  isCurrentPosition: boolean
) => {
  if (!endDate || isCurrentPosition) return true;

  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

// Add this debug code to check the session
const checkSession = async (userId: string) => {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });
    const data = await response.json();
    console.log("Current session user:", data);
    console.log("URL userId:", userId);
    return data;
  } catch (error) {
    console.error("Error checking session:", error);
    return null;
  }
};

// Add this function to calculate duration between two dates
const calculateDuration = (
  startDate: string,
  endDate: string | null
): string => {
  if (!endDate) return "";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  // Calculate years and months
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  // Adjust if months is negative
  if (months < 0) {
    years--;
    months += 12;
  }

  // Format the duration string
  let durationStr = "";
  if (years > 0) {
    durationStr += `${years} ${years === 1 ? "yr" : "yrs"}`;
  }

  if (months > 0) {
    if (durationStr) durationStr += " ";
    durationStr += `${months} ${months === 1 ? "mo" : "mos"}`;
  }

  // If less than a month, show "< 1 mo"
  if (years === 0 && months === 0) {
    durationStr = "< 1 mo";
  }

  return durationStr;
};

//The Experience component is defined as a functional component that takes userId as a prop.
export default function Experiences({ userId }: ExperienceProps) {
  // A state variable error is initialized to null.
  const [localError, setLocalError] = useState<string | null>(null);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExperiences, setEditedExperiences] = useState<Experience[]>([]);
  // Add state for adding new experience
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newExperience, setNewExperience] = useState<Omit<Experience, "id">>({
    position: "", // Changed from title to position
    company: "",
    startDate: getCurrentDate(),
    endDate: null,
    description: "",
    location: "",
    isCurrentPosition: false,
  });

  console.log("ln152: userId:", userId);

  // Add a state for tracking submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update validation errors state to include zod validation results
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: z.ZodIssue[] | { [field: string]: boolean };
  }>({});

  //The useSWR hook is used to fetch the experiences data from the API.
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/experiences`,
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setExperienceData(data);
      setEditedExperiences(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    }
  }, [data]);

  // Call this in useEffect
  useEffect(() => {
    checkSession(userId);
  }, [userId]);

  const validateExperience = (
    experience: Experience | Omit<Experience, "id">,
    id?: string
  ) => {
    try {
      // Validate with Zod schema
      experienceSchema.parse(experience);

      // If validation passes and we have an ID, clear any existing errors
      if (id) {
        setValidationErrors((prev) => ({
          ...prev,
          [id]: [],
        }));
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Store Zod validation issues
        if (id) {
          setValidationErrors((prev) => ({
            ...prev,
            [id]: error.issues,
          }));
        }
        return false;
      }
      return false;
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Validate all experiences before saving
      let hasErrors = false;

      editedExperiences.forEach((exp) => {
        if (!validateExperience(exp, exp.id)) {
          hasErrors = true;
        }
      });

      if (hasErrors) {
        alert("Please fill out all required fields before saving.");
        return;
      }

      saveChanges();
    } else {
      setEditedExperiences(
        experienceData.map((exp) => ({
          ...exp,
          startDate: exp.startDate
            ? formatDateForInput(exp.startDate)
            : getCurrentDate(),
          endDate: exp.endDate
            ? formatDateForInput(exp.endDate)
            : getCurrentDate(),
        }))
      );
      // Reset validation errors when entering edit mode
      setValidationErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    id: string,
    field: keyof Experience,
    value: string | boolean | null
  ) => {
    // First update the experience in state
    const updatedExperiences = editedExperiences.map((exp) => {
      if (exp.id === id) {
        const updatedExp = { ...exp, [field]: value };

        // If changing dates or current position status, validate the date relationship
        if (
          field === "startDate" ||
          field === "endDate" ||
          field === "isCurrentPosition"
        ) {
          // Only validate if we have both dates and it's not marked as current position
          if (
            updatedExp.startDate &&
            updatedExp.endDate &&
            !updatedExp.isCurrentPosition
          ) {
            const isValid = validateDateRange(
              updatedExp.startDate,
              updatedExp.endDate,
              updatedExp.isCurrentPosition
            );

            // If invalid, update validation errors
            if (!isValid) {
              setValidationErrors((prev) => ({
                ...prev,
                [id]: Array.isArray(prev[id])
                  ? [
                      ...(prev[id] as z.ZodIssue[]).filter(
                        (issue) =>
                          !issue.path.includes("startDate") &&
                          !issue.path.includes("endDate")
                      ),
                      {
                        code: "custom",
                        path: ["startDate", "endDate"],
                        message: "Start date cannot be after end date",
                      },
                    ]
                  : [
                      {
                        code: "custom",
                        path: ["startDate", "endDate"],
                        message: "Start date cannot be after end date",
                      },
                    ],
              }));
            } else {
              // Clear date relationship errors if valid
              setValidationErrors((prev) => {
                if (!Array.isArray(prev[id])) return prev;

                return {
                  ...prev,
                  [id]: (prev[id] as z.ZodIssue[]).filter(
                    (issue) =>
                      !(
                        issue.path.includes("startDate") &&
                        issue.path.includes("endDate")
                      )
                  ),
                };
              });
            }
          }
        }

        return updatedExp;
      }
      return exp;
    });

    setEditedExperiences(updatedExperiences);

    // Clear individual field validation errors as before
    if (validationErrors[id]) {
      // If using Zod issues array
      if (Array.isArray(validationErrors[id])) {
        const issues = validationErrors[id] as z.ZodIssue[];
        const updatedIssues = issues.filter(
          (issue) =>
            !issue.path.includes(field as string) ||
            (issue.path.length > 1 &&
              issue.path.includes("startDate") &&
              issue.path.includes("endDate"))
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

  const saveChanges = async () => {
    try {
      setIsSubmitting(true);

      for (const experience of editedExperiences) {
        const response = await fetch(`/api/experiences/${experience.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            position: experience.position,
            company: experience.company,
            startDate: formatDateForDatabase(experience.startDate),
            endDate: experience.endDate
              ? formatDateForDatabase(experience.endDate)
              : null,
            description: experience.description,
            location: experience.location,
            isCurrentPosition: experience.isCurrentPosition,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            // Handle unauthorized - redirect to login
            window.location.href = "/login";
            return;
          }
          throw new Error(
            `Failed to update experience: ${
              errorData.error || response.statusText
            }`
          );
        }
      }

      setExperienceData(editedExperiences);
      mutate();
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewExperience({
      position: "", // Changed from title to position
      company: "",
      startDate: getCurrentDate(),
      endDate: null,
      description: "",
      location: "",
      isCurrentPosition: false,
    });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
  };

  const handleNewExperienceChange = (
    field: keyof Omit<Experience, "id">,
    value: string | boolean | null
  ) => {
    const updatedExperience = { ...newExperience, [field]: value };
    setNewExperience(updatedExperience);

    // If changing dates or current position status, validate the date relationship
    if (
      field === "startDate" ||
      field === "endDate" ||
      field === "isCurrentPosition"
    ) {
      // Only validate if we have both dates and it's not marked as current position
      if (
        updatedExperience.startDate &&
        updatedExperience.endDate &&
        !updatedExperience.isCurrentPosition
      ) {
        const isValid = validateDateRange(
          updatedExperience.startDate,
          updatedExperience.endDate,
          updatedExperience.isCurrentPosition
        );

        // If invalid, update validation errors
        if (!isValid) {
          setValidationErrors((prev) => ({
            ...prev,
            new: Array.isArray(prev.new)
              ? [
                  ...(prev.new as z.ZodIssue[]).filter(
                    (issue) =>
                      !issue.path.includes("startDate") &&
                      !issue.path.includes("endDate")
                  ),
                  {
                    code: "custom",
                    path: ["startDate", "endDate"],
                    message: "Start date cannot be after end date",
                  },
                ]
              : [
                  {
                    code: "custom",
                    path: ["startDate", "endDate"],
                    message: "Start date cannot be after end date",
                  },
                ],
          }));
        } else {
          // Clear date relationship errors if valid
          setValidationErrors((prev) => {
            if (!Array.isArray(prev.new)) return prev;

            return {
              ...prev,
              new: (prev.new as z.ZodIssue[]).filter(
                (issue) =>
                  !(
                    issue.path.includes("startDate") &&
                    issue.path.includes("endDate")
                  )
              ),
            };
          });
        }
      }
    }
  };

  const handleSaveNewExperience = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the new experience with Zod
    try {
      experienceSchema.parse(newExperience);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors((prev) => ({
          ...prev,
          new: error.issues,
        }));
        return;
      }
    }

    try {
      // Format dates properly
      const formattedExperience = {
        ...newExperience,
        startDate: newExperience.startDate
          ? new Date(newExperience.startDate).toISOString()
          : new Date().toISOString(),
        endDate:
          newExperience.endDate && !newExperience.isCurrentPosition
            ? new Date(newExperience.endDate).toISOString()
            : null,
        isCurrentPosition: newExperience.isCurrentPosition || false,
        // Ensure description is a string or empty string, not undefined
        description: newExperience.description || "",
      };

      // Log the formatted experience data
      console.log("Sending experience data:", formattedExperience);

      const response = await fetch(`/api/users/${userId}/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedExperience),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error details:", errorData);
        throw new Error(
          `Failed to add experience: ${errorData.error || response.statusText}`
        );
      }

      // Reset form and refresh data
      setIsAddingNew(false);
      setNewExperience({
        position: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrentPosition: false,
      });

      // Refresh the data
      mutate();
    } catch (error) {
      console.error("Error adding experience:", error);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      // If it's a temporary ID (new unsaved entry), just remove it from state
      if (id.startsWith("temp-")) {
        setEditedExperiences(editedExperiences.filter((exp) => exp.id !== id));
        return;
      }

      const response = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete experience: ${response.statusText}`);
      }

      // Remove from local state and refresh data
      setEditedExperiences(editedExperiences.filter((exp) => exp.id !== id));
      mutate();
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Failed to delete experience. Please try again.");
    }
  };

  // Helper function to get field error message
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
  const hasDateRangeError = (id: string): boolean => {
    if (!validationErrors[id] || !Array.isArray(validationErrors[id]))
      return false;

    const issues = validationErrors[id] as z.ZodIssue[];
    return issues.some(
      (issue) =>
        issue.path.includes("startDate") &&
        issue.path.includes("endDate") &&
        issue.message === ""
    );
  };

  // Add a function to get the date range error message
  const getDateRangeError = (id: string): string | null => {
    if (!validationErrors[id] || !Array.isArray(validationErrors[id]))
      return null;

    const issues = validationErrors[id] as z.ZodIssue[];
    const issue = issues.find(
      (issue) =>
        issue.path.includes("startDate") && issue.path.includes("endDate")
    );

    return issue ? issue.message : null;
  };

  if (isLoading) return <div>Loading experiences...</div>;
  if (error) return <div>Error loading experiences: {error.message}</div>;
  if (localError) return <div>Error: {localError}</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Experience
          </h3>

          <div className="flex gap-2">
            {!isAddingNew && !isEditing && (
              <Button variant="ghost" size="sm" onClick={handleAddNew}>
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

        {/* Add New Experience Form */}
        {isAddingNew && (
          <div className="mb-6 border-b pb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {newExperience.company.substring(0, 2).toUpperCase() ||
                      "NE"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                <div className="mb-2">
                  <Input
                    value={newExperience.position}
                    onChange={(e) =>
                      handleNewExperienceChange("position", e.target.value)
                    }
                    className={`text-muted-foreground ${
                      getFieldError("new", "position")
                        ? "border-red-500 ring-red-500"
                        : ""
                    }`}
                    placeholder="Position*"
                  />
                  {getFieldError("new", "position") && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError("new", "position")}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <Input
                    value={newExperience.company}
                    onChange={(e) =>
                      handleNewExperienceChange("company", e.target.value)
                    }
                    className={`text-muted-foreground ${
                      getFieldError("new", "company")
                        ? "border-red-500 ring-red-500"
                        : ""
                    }`}
                    placeholder="Company*"
                  />
                  {getFieldError("new", "company") && (
                    <p className="text-red-500 text-xs mt-1">
                      {getFieldError("new", "company")}
                    </p>
                  )}
                </div>

                <Input
                  value={newExperience.location}
                  onChange={(e) =>
                    handleNewExperienceChange("location", e.target.value)
                  }
                  className="text-muted-foreground mb-2"
                  placeholder="Location"
                />
                <div className="flex gap-2 mb-2">
                  <div className="w-1/2">
                    <label className="text-xs text-muted-foreground">
                      Start Date* (Month/Year)
                    </label>
                    <Input
                      type="date"
                      value={newExperience.startDate}
                      onChange={(e) =>
                        handleNewExperienceChange("startDate", e.target.value)
                      }
                      className={`text-sm text-muted-foreground ${
                        getFieldError("new", "startDate") ||
                        hasDateRangeError("new")
                          ? "border-red-500 ring-red-500"
                          : ""
                      }`}
                      max={getCurrentDate()}
                    />
                    {getFieldError("new", "startDate") && (
                      <p className="text-red-500 text-xs mt-1">
                        {getFieldError("new", "startDate")}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs text-muted-foreground">
                      End Date (or leave empty for Present)
                    </label>
                    <Input
                      type="date"
                      value={newExperience.endDate || ""}
                      onChange={(e) =>
                        handleNewExperienceChange(
                          "endDate",
                          e.target.value || null
                        )
                      }
                      className={`text-sm text-muted-foreground ${
                        hasDateRangeError("new")
                          ? "border-red-500 ring-red-500"
                          : ""
                      }`}
                      placeholder="Present"
                      max={getCurrentDate()}
                    />
                  </div>
                </div>
                {hasDateRangeError("new") && (
                  <p className="text-red-500 text-xs mt-1 mb-2">
                    {getDateRangeError("new")}
                  </p>
                )}
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="current-new-experience"
                    checked={newExperience.isCurrentPosition}
                    onChange={(e) =>
                      handleNewExperienceChange(
                        "isCurrentPosition",
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  <label htmlFor="current-new-experience" className="text-sm">
                    Current Position
                  </label>
                </div>
                <Textarea
                  value={newExperience.description}
                  onChange={(e) =>
                    handleNewExperienceChange("description", e.target.value)
                  }
                  className="mt-2"
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleCancelAdd}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveNewExperience}>
                    Save Experience
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {(isEditing ? editedExperiences : experienceData) &&
        (isEditing ? editedExperiences : experienceData).length > 0
          ? (isEditing ? editedExperiences : experienceData).map(
              (experience: Experience, index: number) => (
                <div
                  key={experience.id}
                  className="flex flex-col sm:flex-row gap-4 mb-6 relative border-b pb-4 last:border-b-0"
                >
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {experience.company.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-grow">
                    {isEditing ? (
                      <>
                        <div className="mb-2">
                          <Input
                            value={experience.position}
                            onChange={(e) =>
                              handleInputChange(
                                experience.id,
                                "position",
                                e.target.value
                              )
                            }
                            className={`font-semibold w-full p-1 border rounded ${
                              getFieldError(experience.id, "position")
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                            placeholder="Position*"
                          />
                          {getFieldError(experience.id, "position") && (
                            <p className="text-red-500 text-xs mt-1">
                              {getFieldError(experience.id, "position")}
                            </p>
                          )}
                        </div>

                        <div className="mb-2">
                          <Input
                            value={experience.company}
                            onChange={(e) =>
                              handleInputChange(
                                experience.id,
                                "company",
                                e.target.value
                              )
                            }
                            className={`text-muted-foreground w-full p-1 border rounded ${
                              getFieldError(experience.id, "company")
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                            placeholder="Company*"
                          />
                          {getFieldError(experience.id, "company") && (
                            <p className="text-red-500 text-xs mt-1">
                              {getFieldError(experience.id, "company")}
                            </p>
                          )}
                        </div>

                        <Input
                          value={experience.location}
                          onChange={(e) =>
                            handleInputChange(
                              experience.id,
                              "location",
                              e.target.value
                            )
                          }
                          className="text-muted-foreground mb-2 w-full p-1 border rounded"
                          placeholder="Location"
                        />
                        <div className="flex gap-2 mb-2">
                          <div className="w-1/2">
                            <label className="text-xs text-muted-foreground">
                              Start Date* (Month/Year)
                            </label>
                            <Input
                              type="date"
                              value={experience.startDate}
                              onChange={(e) =>
                                handleInputChange(
                                  experience.id,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              className={`text-sm text-muted-foreground p-1 border rounded ${
                                getFieldError(experience.id, "startDate") ||
                                hasDateRangeError(experience.id)
                                  ? "border-red-500 ring-red-500"
                                  : ""
                              }`}
                              max={getCurrentDate()}
                            />
                            {getFieldError(experience.id, "startDate") && (
                              <p className="text-red-500 text-xs mt-1">
                                {getFieldError(experience.id, "startDate")}
                              </p>
                            )}
                          </div>
                          <div className="w-1/2">
                            <label className="text-xs text-muted-foreground">
                              End Date (Month/Year or leave empty for Present)
                            </label>
                            <Input
                              type="date"
                              value={
                                experience.endDate ? experience.endDate : ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  experience.id,
                                  "endDate",
                                  e.target.value || null
                                )
                              }
                              className={`text-sm text-muted-foreground p-1 border rounded ${
                                hasDateRangeError(experience.id)
                                  ? "border-red-500 ring-red-500"
                                  : ""
                              }`}
                              max={getCurrentDate()}
                            />
                          </div>
                        </div>
                        {hasDateRangeError(experience.id) && (
                          <p className="text-red-500 text-xs mt-1 mb-2">
                            {getDateRangeError(experience.id)}
                          </p>
                        )}
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`current-${experience.id}`}
                            checked={experience.isCurrentPosition}
                            onChange={(e) =>
                              handleInputChange(
                                experience.id,
                                "isCurrentPosition",
                                e.target.checked
                              )
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`current-${experience.id}`}
                            className="text-sm"
                          >
                            Current Position
                          </label>
                        </div>
                        <Textarea
                          value={experience.description}
                          onChange={(e) =>
                            handleInputChange(
                              experience.id,
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
                        <p className="font-medium">{experience.position}</p>
                        <p className="text-muted-foreground">
                          {experience.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateForDisplay(experience.startDate)} -{" "}
                          {experience.endDate
                            ? formatDateForDisplay(experience.endDate)
                            : "Present"}
                          {experience.startDate &&
                            (experience.endDate ||
                              experience.isCurrentPosition) && (
                              <>
                                {" "}
                                ·{" "}
                                {calculateDuration(
                                  experience.startDate,
                                  experience.endDate || new Date().toISOString()
                                )}
                              </>
                            )}
                        </p>
                        <p className="mt-2">{experience.description}</p>
                      </>
                    )}

                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 text-red-500"
                        onClick={() => handleDeleteExperience(experience.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            )
          : !isAddingNew && (
              <div className="text-center py-4 text-muted-foreground">
                No experience entries found. Click "Add New" to add your work
                history.
              </div>
            )}

        {/* Add a note about required fields */}
        {(isEditing || isAddingNew) && (
          <div className="text-sm text-muted-foreground mt-4">
            * Required fields
          </div>
        )}
      </CardContent>
    </Card>
  );
}
