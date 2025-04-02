"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useExperiences } from "@/app/hooks/use-user";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useFormValidation,
  useValidationHelpers,
} from "@/app/hooks/form/use-form-validation";
import {
  formatDateForInput,
  formatDateForDisplay,
  getCurrentDate,
  calculateDuration,
} from "@/app/lib/utils/date-utils";
import { AddButton } from "@/app/profile/components/ui/AddButton";
import { EditButton } from "@/app/profile/components/ui/EditButton";
import { DoneButton } from "@/app/profile/components/ui/DoneButton";

interface Experience {
  id: string;
  position: string; // Changed from title to position
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  isCurrentPosition: boolean;
}

//Defines the props for the Experience component, which  a userId.
interface ExperienceProps {
  userId: string;
}

// Add a function to handle date relationship validation in the UI
const validateDateRange = (
  startDate: string,
  endDate: string,
  isCurrentPosition: boolean
) => {
  // if the end date is empty or the experience is currently active, return true
  if (!endDate || endDate === "" || isCurrentPosition) return true;

  const start = new Date(startDate);
  const end = new Date(endDate);
  // if the start date is before the end date, return true
  return start <= end;
};

// Add this debug code to check the session
const checkSession = async (userId: string) => {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include", // include the session cookie in the request
    });

    if (!response.ok) {
      console.error(
        "Session check failed:",
        response.status,
        response.statusText
      );
      return null;
    }

    const data = await response.json();
    console.log("ln80: Current session user:", data);
    console.log("ln81: api call userId:", userId);

    // Check also if we can access the experiences endpoint
    try {
      console.log("ln141: fetching experiences");
      const experiencesResponse = await fetch(
        `/api/users/${userId}/experiences`,
        {
          credentials: "include",
        }
      );
      if (experiencesResponse.ok) {
        console.log("ln93: experiences endpoint is ok");
        const expData = await experiencesResponse.json();
        console.log("ln95: experiences data:", expData);
      }
    } catch (expError) {
      console.error("ln98: Experiences endpoint check failed:", expError);
    }

    return data;
  } catch (error) {
    console.error("ln103: Error checking session:", error);
    return null;
  }
};

//The Experience component is defined as a functional component that takes userId as a prop.
export default function Experiences({ userId }: ExperienceProps) {
  // Replace the useSWR call with the custom hook
  const { experiences, isLoading, isError, mutate } = useExperiences(userId);

  // Use the form validation hook correctly with initial values and validation rules
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  } = useFormValidation(
    {
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
      isCurrentPosition: false,
    },
    {
      position: (value) => (!value ? "Position is required" : null),
      company: (value) => (!value ? "Company is required" : null),
      startDate: (value) => (!value ? "Start date is required" : null),
      endDate: () => null, // Optional
      description: () => null, // Optional
      location: () => null, // Optional
      isCurrentPosition: () => null, // No validation needed
    }
  );

  const validationHelpers = useValidationHelpers(
    errors,
    touched,
    validateForm,
    handleBlur,
    values
  );
  const {
    getFieldError,
    touchField,
    hasErrorType,
    getErrorTypeMessage,
    getInputClassName,
    validateData,
  } = validationHelpers;

  console.log("ln160: validationHelpers:", validationHelpers);

  // A state variable error is initialized to null.
  const [localError, setLocalError] = useState<string | null>(null);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExperiences, setEditedExperiences] = useState<Experience[]>([]);
  // Add state for adding new experience
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newExperience, setNewExperience] = useState({
    position: "",
    company: "",
    location: "",
    startDate: getCurrentDate(),
    endDate: "",
    isCurrentPosition: false,
    description: "",
  });

  // Add a state variable for editing experience
  const [editingExperience, setEditingExperience] = useState({
    id: "",
    position: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrentPosition: false,
    description: "",
  });

  // Add a state for tracking submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  // Update local state when data is fetched
  useEffect(() => {
    console.log("ln216: apiResponse:", experiences);
    if (experiences && experiences.data) {
      // Extract the data array from the API response
      const experiencesData = experiences.data || [];
      setExperienceData(experiencesData);

      // Format dates for editing
      const formattedExperiences =
        experiencesData && Array.isArray(experiencesData)
          ? experiencesData.map((exp: Experience) => ({
              ...exp,
              startDate: exp.startDate ? formatDateForInput(exp.startDate) : "",
              endDate: exp.endDate ? formatDateForInput(exp.endDate) : "",
              location: exp.location || "",
              description: exp.description || "",
            }))
          : [];

      setEditedExperiences(formattedExperiences);
    }
  }, [experiences, setExperienceData, setEditedExperiences]);

  // Call this in useEffect
  useEffect(() => {
    checkSession(userId);
  }, [userId]);

  // Define the missing saveChanges function
  const saveChanges = async () => {
    try {
      setIsSubmitting(true);
      // Save each edited experience
      for (const experience of editedExperiences) {
        const response = await fetch(`/api/experiences/${experience.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(experience),
        });

        if (!response.ok) {
          throw new Error(`Failed to update experience ${experience.id}`);
        }
      }

      // Refresh data from the server
      mutate();
    } catch (error) {
      console.error("Error saving experiences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    id: string,
    field: keyof Experience,
    value: any
  ) => {
    // Convert null to empty string for input fields to avoid React warnings
    const processedValue = field === "endDate" && value === null ? "" : value;

    // Update your state
    setEditedExperiences((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, [field]: processedValue } : exp
      )
    );

    // Mark field as touched
    touchField(id);

    // Get the updated experience object
    const updatedExperience = editedExperiences.find((exp) => exp.id === id);
    if (updatedExperience) {
      // Create a copy with the new value
      const experienceToValidate = {
        ...updatedExperience,
        [field]: processedValue,
      };

      // Validate the updated data
      validateData();
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewExperience({
      position: "",
      company: "",
      location: "",
      startDate: getCurrentDate(),
      endDate: "",
      isCurrentPosition: false,
      description: "",
    });
  };

  const CancelAdd = () => {
    setIsAddingNew(false);
  };

  const handleNewExperienceChange = (
    field: keyof Omit<Experience, "id">,
    value: string | boolean | null
  ) => {
    // For input fields, convert null to empty string to avoid React warning
    const processedValue = field === "endDate" && value === null ? "" : value;
    const updatedExperience = { ...newExperience, [field]: processedValue };
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
          touchField("new");
          validateData();
        } else {
          // Clear date relationship errors if valid
          touchField("new");
          validateData();
        }
      }
    }
  };

  // Create a new experience
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the new flat API structure - no userId in the URL
      const response = await fetch(`/api/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExperience),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error details:", errorData);
        throw new Error(errorData.message || "Failed to add experience");
      }

      const data = await response.json();
      setExperienceData([...experienceData, data.data]);
      setNewExperience({
        company: "",
        position: "",
        location: "",
        startDate: getCurrentDate(),
        endDate: "",
        isCurrentPosition: false,
        description: "",
      });
      setIsAddingNew(false);
    } catch (error) {
      console.error("Error adding experience:", error);
      // Handle error display to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    // Use window.confirm to get user confirmation
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      // Immediately update UI state to remove the experience
      // This prevents flickering by making the change appear instant
      setEditedExperiences((prev) => prev.filter((exp) => exp.id !== id));
      setExperienceData((prev) => prev.filter((exp) => exp.id !== id));

      // If it's a temporary ID (new unsaved entry), we're done
      if (id.startsWith("temp-")) {
        return;
      }

      // Make API call in the background
      const response = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Silently log any errors but don't show to user
      if (!response.ok) {
        console.error(
          `API error when deleting experience: ${response.status} ${response.statusText}`
        );
      }

      // Use mutate with false to avoid revalidation which can cause flickering
      // The data is already updated in the UI
      mutate(undefined, { revalidate: false });
    } catch (error) {
      console.error("Error during experience deletion:", error);
      // We've already updated the UI, so no need to do it again
      // Just log the error and continue
    }
  };

  const handleEdit = (experience: Experience) => {
    // Force hide the add form
    setIsAddingNew(false);

    setEditingExperience({
      id: experience.id,
      position: experience.position,
      company: experience.company,
      location: experience.location || "",
      startDate: formatDateForInput(experience.startDate),
      endDate: experience.endDate ? formatDateForInput(experience.endDate) : "",
      isCurrentPosition: experience.isCurrentPosition || false,
      description: experience.description || "",
    });

    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingExperience) return;

    // Validate required fields
    if (
      !editingExperience.company ||
      !editingExperience.position ||
      !editingExperience.startDate
    ) {
      setValidationError("Please fill out all required fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setValidationError("");

    try {
      const response = await fetch(`/api/experiences/${editingExperience.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingExperience),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update experience");
      }

      const data = await response.json();
      const updatedExperience = data.data;

      setExperienceData(
        experienceData.map((exp) =>
          exp.id === updatedExperience.id ? updatedExperience : exp
        )
      );

      // Reset editing state
      setIsEditing(false);
      setEditingExperience({
        id: "",
        position: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrentPosition: false,
        description: "",
      });
    } catch (error) {
      console.error("Error updating experience:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!editingExperience) return;

    const { name, value, type } = e.target;

    // Handle checkboxes separately
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingExperience({
        ...editingExperience,
        [name]: checked,
        // If "currently working" is checked, clear the end date
        ...(name === "isCurrentPosition" && checked ? { endDate: "" } : {}),
      });
    } else {
      // For date inputs, ensure we never pass null to input value props
      const processedValue = name === "endDate" && value === "" ? "" : value;
      setEditingExperience({
        ...editingExperience,
        [name]: processedValue,
      });
    }

    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError("");
    }
  };

  // Simplified toggleAddForm without references to edit mode
  // const toggleAddForm = () => {
  //   setIsAddingNew(!isAddingNew);
  //   setValidationError("");
  // };

  // When canceling an edit, just reset the edit state
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingExperience({
      id: "",
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentPosition: false,
      description: "",
    });
    setValidationError("");
  };

  if (isLoading)
    return <LoadingSpinner size="sm" text="Loading experiences..." />;
  if (isError) return <div>Error loading experiences: {isError.message}</div>;
  if (localError) return <div>Error: {localError}</div>;

  const onClickAddNew = () => {
    setIsAddingNew(!isAddingNew);
    setValidationError("");
  };

  const onClickDone = () => {
    // Explicitly close the add form when toggling edit mode
    setIsAddingNew(false);

    if (isEditing) {
      // Validate all experiences before saving
      let hasErrors = false;

      editedExperiences.forEach((exp) => {
        if (!validateData()) {
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
          startDate: exp.startDate ? formatDateForInput(exp.startDate) : "",
          endDate: exp.endDate ? formatDateForInput(exp.endDate) : "",
        }))
      );
      // Reset validation errors when entering edit mode
      resetForm();
    }
    setIsEditing(!isEditing);
  };

  const onClickEdit = () => {
    // Explicitly close the add form when toggling edit mode
    setIsAddingNew(false);

    if (isEditing) {
      // Validate all experiences before saving
      let hasErrors = false;

      editedExperiences.forEach((exp) => {
        if (!validateData()) {
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
          startDate: exp.startDate ? formatDateForInput(exp.startDate) : "",
          endDate: exp.endDate ? formatDateForInput(exp.endDate) : "",
        }))
      );
      // Reset validation errors when entering edit mode
      resetForm();
    }
    setIsEditing(!isEditing);
  };

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
                    className={getInputClassName("new", "position")}
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
                    className={getInputClassName("new", "company")}
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
                      className={getInputClassName("new", "startDate")}
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
                          e.target.value || ""
                        )
                      }
                      className={getInputClassName("new", "endDate")}
                      placeholder="Present"
                      max={getCurrentDate()}
                    />
                  </div>
                </div>
                {hasErrorType("new", ["startDate", "endDate"]) && (
                  <p className="text-red-500 text-xs mt-1 mb-2">
                    {getErrorTypeMessage("new", ["startDate", "endDate"])}
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
                  className={getInputClassName("new", "description")}
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={CancelAdd}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleFormSubmit}>
                    Save Experience
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleSave} className="space-y-4 mt-4">
            {validationError && (
              <div className="text-red-500 text-sm">{validationError}</div>
            )}
            {editingExperience && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {editingExperience.company.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-grow">
                  <div className="mb-2">
                    <Input
                      value={editingExperience.position}
                      onChange={handleEditChange}
                      name="position"
                      className={getInputClassName(
                        editingExperience.id,
                        "position"
                      )}
                      placeholder="Position*"
                    />
                    {getFieldError(editingExperience.id, "position") && (
                      <p className="text-red-500 text-xs mt-1">
                        {getFieldError(editingExperience.id, "position")}
                      </p>
                    )}
                  </div>

                  <div className="mb-2">
                    <Input
                      value={editingExperience.company}
                      onChange={handleEditChange}
                      name="company"
                      className={getInputClassName(
                        editingExperience.id,
                        "company"
                      )}
                      placeholder="Company*"
                    />
                    {getFieldError(editingExperience.id, "company") && (
                      <p className="text-red-500 text-xs mt-1">
                        {getFieldError(editingExperience.id, "company")}
                      </p>
                    )}
                  </div>

                  <Input
                    value={editingExperience.location}
                    onChange={(e) =>
                      handleInputChange(
                        editingExperience.id,
                        "location",
                        e.target.value
                      )
                    }
                    name="location"
                    className={getInputClassName(
                      editingExperience.id,
                      "location"
                    )}
                    placeholder="Location"
                  />
                  <div className="flex gap-2 mb-2">
                    <div className="w-1/2">
                      <label className="text-xs text-muted-foreground">
                        Start Date* (Month/Year)
                      </label>
                      <Input
                        type="date"
                        value={editingExperience.startDate}
                        onChange={(e) =>
                          handleInputChange(
                            editingExperience.id,
                            "startDate",
                            e.target.value
                          )
                        }
                        name="startDate"
                        className={getInputClassName(
                          editingExperience.id,
                          "startDate"
                        )}
                        max={getCurrentDate()}
                      />
                      {getFieldError(editingExperience.id, "startDate") && (
                        <p className="text-red-500 text-xs mt-1">
                          {getFieldError(editingExperience.id, "startDate")}
                        </p>
                      )}
                    </div>
                    <div className="w-1/2">
                      <label className="text-xs text-muted-foreground">
                        End Date (Month/Year or leave empty for Present)
                      </label>
                      <Input
                        type="date"
                        value={editingExperience.endDate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            editingExperience.id,
                            "endDate",
                            e.target.value || ""
                          )
                        }
                        name="endDate"
                        className={getInputClassName(
                          editingExperience.id,
                          "endDate"
                        )}
                        max={getCurrentDate()}
                      />
                    </div>
                  </div>
                  {hasErrorType(editingExperience.id, [
                    "startDate",
                    "endDate",
                  ]) && (
                    <p className="text-red-500 text-xs mt-1 mb-2">
                      {getErrorTypeMessage(editingExperience.id, [
                        "startDate",
                        "endDate",
                      ])}
                    </p>
                  )}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`current-${editingExperience.id}`}
                      checked={editingExperience.isCurrentPosition}
                      onChange={handleEditChange}
                      name="isCurrentPosition"
                      className="mr-2"
                    />
                    <label
                      htmlFor={`current-${editingExperience.id}`}
                      className="text-sm"
                    >
                      Current Position
                    </label>
                  </div>
                  <Textarea
                    value={editingExperience.description}
                    onChange={(e) =>
                      handleInputChange(
                        editingExperience.id,
                        "description",
                        e.target.value
                      )
                    }
                    name="description"
                    className={getInputClassName(
                      editingExperience.id,
                      "description"
                    )}
                    rows={4}
                    placeholder="Description (optional)"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
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
                            className={getInputClassName(
                              experience.id,
                              "position"
                            )}
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
                            className={getInputClassName(
                              experience.id,
                              "company"
                            )}
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
                          className={getInputClassName(
                            experience.id,
                            "location"
                          )}
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
                              className={getInputClassName(
                                experience.id,
                                "startDate"
                              )}
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
                              value={experience.endDate || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  experience.id,
                                  "endDate",
                                  e.target.value || ""
                                )
                              }
                              className={getInputClassName(
                                experience.id,
                                "endDate"
                              )}
                              max={getCurrentDate()}
                            />
                          </div>
                        </div>
                        {hasErrorType(experience.id, [
                          "startDate",
                          "endDate",
                        ]) && (
                          <p className="text-red-500 text-xs mt-1 mb-2">
                            {getErrorTypeMessage(experience.id, [
                              "startDate",
                              "endDate",
                            ])}
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
                          className={getInputClassName(
                            experience.id,
                            "description"
                          )}
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
