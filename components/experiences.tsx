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

  // Add a state for tracking submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleEditToggle = () => {
    if (isEditing) {
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
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    id: string,
    field: keyof Experience,
    value: string | boolean | null
  ) => {
    setEditedExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
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
    setNewExperience((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNewExperience = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format dates properly
      const formattedExperience = {
        ...newExperience,
        startDate: newExperience.startDate
          ? new Date(newExperience.startDate).toISOString()
          : new Date().toISOString(), // Provide a default if missing
        endDate:
          newExperience.endDate && !newExperience.isCurrentPosition
            ? new Date(newExperience.endDate).toISOString()
            : null,
        isCurrentPosition: newExperience.isCurrentPosition || false,
      };

      const response = await fetch(`/api/users/${userId}/experiences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedExperience),
      });

      if (!response.ok) {
        const errorData = await response.json();
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
                <Input
                  value={newExperience.position}
                  onChange={(e) =>
                    handleNewExperienceChange("position", e.target.value)
                  }
                  className="text-muted-foreground mb-2"
                  placeholder="Position*"
                />
                <Input
                  value={newExperience.company}
                  onChange={(e) =>
                    handleNewExperienceChange("company", e.target.value)
                  }
                  className="text-muted-foreground mb-2"
                  placeholder="Company*"
                />
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
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={newExperience.startDate}
                      onChange={(e) =>
                        handleNewExperienceChange("startDate", e.target.value)
                      }
                      className="text-sm text-muted-foreground"
                      max={getCurrentDate()}
                    />
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
                      className="text-sm text-muted-foreground"
                      placeholder="Present"
                      max={getCurrentDate()}
                    />
                  </div>
                </div>
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
                        <Input
                          value={experience.position}
                          onChange={(e) =>
                            handleInputChange(
                              experience.id,
                              "position",
                              e.target.value
                            )
                          }
                          className="font-semibold mb-2 w-full p-1 border rounded"
                          placeholder="Position*"
                        />
                        <Input
                          value={experience.company}
                          onChange={(e) =>
                            handleInputChange(
                              experience.id,
                              "company",
                              e.target.value
                            )
                          }
                          className="text-muted-foreground mb-2 w-full p-1 border rounded"
                          placeholder="Company*"
                        />
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
                            className="text-sm text-muted-foreground w-1/2 p-1 border rounded"
                          />
                          <Input
                            type="date"
                            value={experience.endDate ? experience.endDate : ""}
                            onChange={(e) =>
                              handleInputChange(
                                experience.id,
                                "endDate",
                                e.target.value || null
                              )
                            }
                            className="text-sm text-muted-foreground w-1/2 p-1 border rounded"
                          />
                        </div>
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
                          {formatDateForInput(experience.startDate)} -{" "}
                          {experience.endDate
                            ? formatDateForInput(experience.endDate)
                            : "Present"}
                        </p>
                        <p className="mt-2">{experience.description}</p>
                      </>
                    )}

                    {/* AI Suggestion for the first item as an example */}
                    {!isEditing && index === 0 && (
                      <div className="mt-3 p-3 bg-muted rounded-md border border-border">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-grow">
                            <p className="text-sm font-medium">
                              AI Suggestion:
                            </p>
                            <p className="text-sm">
                              Replace "Led development" with a stronger action
                              verb like "Spearheaded" or "Architected" to
                              showcase leadership.
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Regenerate
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
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
      </CardContent>
    </Card>
  );
}
