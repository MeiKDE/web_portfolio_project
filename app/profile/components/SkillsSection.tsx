"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lightbulb, Edit, Save, Plus, X } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useFormValidation,
  useValidationHelpers,
} from "@/app/hooks/form/use-form-validation";
import { useEditableState } from "@/app/hooks/form/use-editable-state";
import { Skill } from "./skills/Interface";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { handleEditToggle } from "./skills/HandleEditToggle";
import { handleSkillInputChange } from "./skills/HandleSkillInputChange";
import { handleNewSkillChange } from "./skills/HandleNewSkillChange";
import { handleAddNew } from "./skills/HandleAddNew";
import { handleCancelAdd } from "./skills/HandleChancelAdd";
import { handleSaveNewSkill } from "./skills/HandleSaveNewSkill";
import { handleDeleteSkill } from "./skills/HandleDeleteSkill";

interface SkillsProps {
  userId: string;
}

export default function Skills({ userId }: SkillsProps) {
  // Replace individual state variables with useEditableState hook
  const {
    isEditing, // replaces editable
    isAddingNew, // replaces isAddingNew
    editedData, // replaces editedSkills
    isSubmitting, // replaces isSubmitting
    saveSuccess,
    newItemData, // replaces newSkill
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
  } = useEditableState<Skill[]>([]);

  // Fetch skills data
  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/users/${userId}/skills`
  );

  // Use validation hook to validate the form fields
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
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    },
    {
      name: (value) => (!value ? "Skill name is required" : null),
      proficiencyLevel: (value) =>
        value < 1 ? "Proficiency level is required" : null,
      category: (value) => (!value ? "Category is required" : null),
    }
  );

  // Add useValidationHelpers to cache the form validation
  const {
    getFieldError,
    touchField,
    hasErrorType,
    getErrorTypeMessage,
    getInputClassName,
    validateData,
  } = useValidationHelpers(errors, touched, validateForm, handleBlur, values);

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      try {
        // takes data from the backend as local state when not editing or adding new
        if (!isEditing && !isAddingNew) {
          setEditedData(data);
        }
      } catch (error) {
        console.error("Error processing skills data:", error);
        setEditedData([]);
      }
    }
  }, [data, setEditedData, isEditing, isAddingNew]);

  // Add this useEffect to ensure data is refreshed after saving
  useEffect(() => {
    if (saveSuccess) {
      const refreshData = async () => {
        await mutate();
        setSaveSuccess(false);
        setIsSubmitting(false);
        setIsAddingNew(false);
      };
      refreshData();
    }
  }, [saveSuccess, mutate, setSaveSuccess, setIsSubmitting, setIsAddingNew]);

  // Add debug effect
  useEffect(() => {
    console.log("Form state:", {
      isAddingNew,
      cancelAddingNew: !!cancelAddingNew,
      resetForm: !!resetForm,
    });
  }, [isAddingNew, cancelAddingNew, resetForm]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading skill information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
          <div className="flex gap-2">
            {!isAddingNew && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddNew(startAddingNew, resetForm)}
              >
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              </Button>
            )}
            {!isAddingNew && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (data) {
                    startEditing();
                    setEditedData(data);
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
            )}
            {/* Add a separate Save button that appears when editing */}
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleSaveEdits({
                    endpoint: `/api/skills`,
                    validateFn: (data) => {
                      try {
                        // Validate each skill
                        if (Array.isArray(data)) {
                          data.forEach((skill) => {
                            if (
                              !skill.name ||
                              !skill.category ||
                              !skill.proficiencyLevel
                            ) {
                              throw new Error(
                                "All required fields must be filled"
                              );
                            }
                          });
                        }
                        return true;
                      } catch (error) {
                        console.error("Validation error:", error);
                        alert("Please fill out all required fields correctly");
                        return false;
                      }
                    },
                    onSuccess: () => {
                      mutate();
                      setIsEditing(false);
                      setSaveSuccess(true);
                    },
                    onError: (error: any) => {
                      console.error("Error saving skills:", error);
                      alert("Failed to save skills. Please try again.");
                    },
                  })
                }
                disabled={isSubmitting}
              >
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save"}
                </>
              </Button>
            )}
          </div>
        </div>

        {/* Add validation error messages */}
        {isEditing &&
          editedData?.map((skill, index) => (
            <div key={skill.id} className="text-sm text-red-500">
              {!skill.name && <p>Name is required</p>}
              {!skill.category && <p>Category is required</p>}
              {(!skill.proficiencyLevel ||
                skill.proficiencyLevel < 1 ||
                skill.proficiencyLevel > 10) && (
                <p>Proficiency level must be between 1 and 10</p>
              )}
            </div>
          ))}

        {/* Add New Skill Form */}
        {isAddingNew && (
          <div className="mb-6 border p-4 rounded-md">
            <h4 className="font-medium mb-3">Add New Skill</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await handleSaveNewSkill(
                    e,
                    validateForm,
                    values,
                    touchField,
                    handleSaveNewItem,
                    userId,
                    mutate,
                    resetForm,
                    cancelAddingNew
                  );
                  // After successful save
                  setIsSubmitting(false);
                  setSaveSuccess(true);
                  setIsAddingNew(false); // Close the form
                  await mutate(); // Refresh the data immediately
                } catch (error) {
                  console.error("Error saving skill:", error);
                  setIsSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div className="mb-2">
                <label className="text-sm text-muted-foreground">
                  Skill Name*
                </label>
                <Input
                  type="text"
                  value={newItemData?.name || ""}
                  onChange={(e) =>
                    handleNewSkillChange(
                      "name",
                      e.target.value,
                      handleNewItemChange,
                      handleChange,
                      values
                    )
                  }
                  onBlur={() => touchField("name")}
                  className={getInputClassName("new", "name", "mt-1")}
                  placeholder="e.g., JavaScript, React, Agile"
                />
                {getFieldError("new", "name") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getFieldError("new", "name")}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label className="text-sm text-muted-foreground">
                  Category*
                </label>
                <Input
                  type="text"
                  value={newItemData?.category || ""}
                  onChange={(e) =>
                    handleNewSkillChange(
                      "category",
                      e.target.value,
                      handleNewItemChange,
                      handleChange,
                      values
                    )
                  }
                  onBlur={() => touchField("category")}
                  className={getInputClassName("new", "category", "mt-1")}
                  placeholder="e.g., Frontend, Backend, DevOps"
                />
                {getFieldError("new", "category") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getFieldError("new", "category")}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label className="text-sm text-muted-foreground">
                  Proficiency Level* (1-5)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={newItemData?.proficiencyLevel || 3}
                  onChange={(e) =>
                    handleNewSkillChange(
                      "proficiencyLevel",
                      parseInt(e.target.value),
                      handleNewItemChange,
                      handleChange,
                      values
                    )
                  }
                  onBlur={() => touchField("proficiencyLevel")}
                  className={getInputClassName(
                    "new",
                    "proficiencyLevel",
                    "mt-1"
                  )}
                />
                {getFieldError("new", "proficiencyLevel") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getFieldError("new", "proficiencyLevel")}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelAdd(cancelAddingNew, resetForm)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={(e) =>
                    handleSaveNewSkill(
                      e,
                      validateForm,
                      values,
                      touchField,
                      handleSaveNewItem,
                      userId,
                      mutate,
                      resetForm,
                      cancelAddingNew
                    )
                  }
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Skill"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Skills List */}
        {!isLoading && !error && (
          <>
            {editedData && editedData.length > 0 ? (
              <div className="space-y-4">
                {editedData.map((skill) => (
                  <div
                    key={skill.id}
                    className="relative border-b pb-4 last:border-0"
                  >
                    {/* Skill content - editable or readonly */}
                    {isEditing ? (
                      <div className="flex gap-2">
                        <div className="w-full">
                          <Input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleSkillInputChange(
                                skill.id,
                                "name",
                                e.target.value,
                                handleInputChange,
                                touchField
                              )
                            }
                            className={`font-medium mb-2 ${
                              !skill.name ? "border-red-500" : ""
                            }`}
                            placeholder="Skill Name *"
                            required
                          />
                          <Input
                            type="text"
                            value={skill.category}
                            onChange={(e) =>
                              handleSkillInputChange(
                                skill.id,
                                "category",
                                e.target.value,
                                handleInputChange,
                                touchField
                              )
                            }
                            className={`text-sm mb-2 ${
                              !skill.category ? "border-red-500" : ""
                            }`}
                            placeholder="Category *"
                            required
                          />
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={skill.proficiencyLevel}
                            onChange={(e) =>
                              handleSkillInputChange(
                                skill.id,
                                "proficiencyLevel",
                                parseInt(e.target.value),
                                handleInputChange,
                                touchField
                              )
                            }
                            className={`text-sm ${
                              !skill.proficiencyLevel ||
                              skill.proficiencyLevel < 1 ||
                              skill.proficiencyLevel > 10
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="Proficiency Level (1-10) *"
                            required
                          />
                        </div>
                        <div className="flex items-start">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteSkill(
                                skill.id,
                                handleDeleteItem,
                                mutate
                              )
                            }
                            className="h-8 w-8 text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{skill.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {skill.category}
                          </p>
                          <div className="flex mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Lightbulb
                                key={i}
                                className={`h-4 w-4 mr-1 ${
                                  i < skill.proficiencyLevel
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No skills added yet.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
