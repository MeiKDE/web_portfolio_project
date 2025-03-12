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

// Add validation errors interface
interface ValidationErrors {
  [key: string]: { [field: string]: boolean };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setEducationData(data);
      setEditedEducation(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    }
  }, [data]);

  // Add validation function
  const validateEducation = (education: Education, id: string) => {
    const errors: { [field: string]: boolean } = {};

    // Check required fields
    if (!education.institution.trim()) errors.institution = true;
    if (!education.degree.trim()) errors.degree = true;
    if (!education.fieldOfStudy.trim()) errors.fieldOfStudy = true;

    // Fix for startYear - check if it exists and is valid
    if (!education.startYear || education.startYear.toString().trim() === "") {
      errors.startYear = true;
    }

    // Update validation errors state
    setValidationErrors((prev) => ({
      ...prev,
      [id]: errors,
    }));

    return Object.keys(errors).length === 0;
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

  const handleInputChange = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setEditedEducation((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );

    // Clear validation error for this field if it exists
    if (validationErrors[id]?.[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: false,
        },
      }));
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

      // Format the payload
      const payload = {
        institution: newEntry.institution,
        degree: newEntry.degree,
        fieldOfStudy: newEntry.fieldOfStudy,
        startYear: parseInt(newEntry.startYear, 10),
        endYear: newEntry.endYear ? parseInt(newEntry.endYear, 10) : null,
        description: newEntry.description || "",
      };

      const response = await fetch(`/api/users/${userId}/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
                      validationErrors[
                        editedEducation[editedEducation.length - 1].id
                      ]?.institution
                        ? "border-red-500 ring-red-500"
                        : ""
                    }`}
                    placeholder="Institution*"
                  />
                  {validationErrors[
                    editedEducation[editedEducation.length - 1].id
                  ]?.institution && (
                    <p className="text-red-500 text-xs mt-1">
                      Institution is required
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
                      validationErrors[
                        editedEducation[editedEducation.length - 1].id
                      ]?.degree
                        ? "border-red-500 ring-red-500"
                        : ""
                    }`}
                    placeholder="Degree*"
                  />
                  {validationErrors[
                    editedEducation[editedEducation.length - 1].id
                  ]?.degree && (
                    <p className="text-red-500 text-xs mt-1">
                      Degree is required
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
                      validationErrors[
                        editedEducation[editedEducation.length - 1].id
                      ]?.fieldOfStudy
                        ? "border-red-500 ring-red-500"
                        : ""
                    }`}
                    placeholder="Field of Study*"
                  />
                  {validationErrors[
                    editedEducation[editedEducation.length - 1].id
                  ]?.fieldOfStudy && (
                    <p className="text-red-500 text-xs mt-1">
                      Field of study is required
                    </p>
                  )}
                </div>

                <div className="flex gap-2 mb-2">
                  <div className="w-1/2">
                    <input
                      type="text"
                      value={
                        editedEducation[editedEducation.length - 1].startYear
                      }
                      onChange={(e) =>
                        handleInputChange(
                          editedEducation[editedEducation.length - 1].id,
                          "startYear",
                          e.target.value
                        )
                      }
                      className={`text-sm text-muted-foreground w-full p-1 border rounded ${
                        validationErrors[
                          editedEducation[editedEducation.length - 1].id
                        ]?.startYear
                          ? "border-red-500 ring-red-500"
                          : ""
                      }`}
                      placeholder="Start Year*"
                    />
                    {validationErrors[
                      editedEducation[editedEducation.length - 1].id
                    ]?.startYear && (
                      <p className="text-red-500 text-xs mt-1">
                        Start year is required
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
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
                      className="text-sm text-muted-foreground w-full p-1 border rounded"
                      placeholder="End Year"
                    />
                  </div>
                </div>

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
                              validationErrors[edu.id]?.institution
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                            placeholder="Institution*"
                          />
                          {validationErrors[edu.id]?.institution && (
                            <p className="text-red-500 text-xs mt-1">
                              Institution is required
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
                              validationErrors[edu.id]?.degree
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                            placeholder="Degree*"
                          />
                          {validationErrors[edu.id]?.degree && (
                            <p className="text-red-500 text-xs mt-1">
                              Degree is required
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
                              validationErrors[edu.id]?.fieldOfStudy
                                ? "border-red-500 ring-red-500"
                                : ""
                            }`}
                            placeholder="Field of Study*"
                          />
                          {validationErrors[edu.id]?.fieldOfStudy && (
                            <p className="text-red-500 text-xs mt-1">
                              Field of study is required
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 mb-2">
                          <div className="w-1/2">
                            <input
                              type="text"
                              value={edu.startYear}
                              onChange={(e) =>
                                handleInputChange(
                                  edu.id,
                                  "startYear",
                                  e.target.value
                                )
                              }
                              className={`text-sm text-muted-foreground w-full p-1 border rounded ${
                                validationErrors[edu.id]?.startYear
                                  ? "border-red-500 ring-red-500"
                                  : ""
                              }`}
                              placeholder="Start Year*"
                            />
                            {validationErrors[edu.id]?.startYear && (
                              <p className="text-red-500 text-xs mt-1">
                                Start year is required
                              </p>
                            )}
                          </div>
                          <div className="w-1/2">
                            <input
                              type="text"
                              value={edu.endYear || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  edu.id,
                                  "endYear",
                                  e.target.value
                                )
                              }
                              className="text-sm text-muted-foreground w-full p-1 border rounded"
                              placeholder="End Year"
                            />
                          </div>
                        </div>

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
