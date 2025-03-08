/** @jsxImportSource react */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Edit, Save, Plus, X } from "lucide-react";
import useSWR from "swr";

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear?: string;
  description?: string;
}

interface EducationProps {
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Educations({ userId }: EducationProps) {
  const [editable, setEditable] = useState(false);
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [editedEducation, setEditedEducation] = useState<Education[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/education`,
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setEducationData(data);
      setEditedEducation(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    }
  }, [data]);

  const handleEditToggle = () => {
    if (editable) {
      saveChanges();
    }
    setEditable(!editable);
  };

  const handleInputChange = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setEditedEducation((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
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
      startYear: new Date().getFullYear().toString(),
      endYear: (new Date().getFullYear() + 4).toString(),
      description: "",
    };

    // Add the new education to the edited list
    setEditedEducation([...editedEducation, newEducation]);

    // Enable editing mode if not already enabled
    if (!editable) {
      setEditable(true);
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
        const startYear = parseInt(education.startYear, 10);
        const payload = {
          institution: education.institution,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          startYear: startYear,
          // Always include endYear, with a default if not provided
          endYear: education.endYear
            ? parseInt(education.endYear, 10)
            : startYear + 4,
          description: education.description,
        };

        console.log("Sending payload:", payload);

        // Check if this is a new entry (has a temp ID)
        const isNewEntry = education.id.startsWith("temp-");

        if (isNewEntry) {
          // Create a new education entry
          console.log("Creating new education entry:", payload);
          const response = await fetch(`/api/education`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
          const response = await fetch(`/api/education/${education.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

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

      const response = await fetch(`/api/education/${id}`, {
        method: "DELETE",
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

  if (isLoading) return <div>Loading education...</div>;
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
            )}
          </div>
        </div>

        {editedEducation.length > 0 || editable ? (
          editedEducation.map((edu, index) => (
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
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        handleInputChange(edu.id, "institution", e.target.value)
                      }
                      className="font-semibold mb-2 w-full p-1 border rounded"
                      placeholder="Institution*"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        handleInputChange(edu.id, "degree", e.target.value)
                      }
                      className="text-muted-foreground mb-2 w-full p-1 border rounded"
                      placeholder="Degree*"
                    />
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
                      className="text-muted-foreground mb-2 w-full p-1 border rounded"
                      placeholder="Field of Study*"
                    />
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={edu.startYear}
                        onChange={(e) =>
                          handleInputChange(edu.id, "startYear", e.target.value)
                        }
                        className="text-sm text-muted-foreground w-1/2 p-1 border rounded"
                        placeholder="Start Year*"
                      />
                      <input
                        type="text"
                        value={edu.endYear || ""}
                        onChange={(e) =>
                          handleInputChange(edu.id, "endYear", e.target.value)
                        }
                        className="text-sm text-muted-foreground w-1/2 p-1 border rounded"
                        placeholder="End Year"
                      />
                    </div>
                    <textarea
                      value={edu.description || ""}
                      onChange={(e) =>
                        handleInputChange(edu.id, "description", e.target.value)
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
          <div className="text-muted-foreground text-sm">
            No education information available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
