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

  // Use the form validation hook for the skill form
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

  // Add useValidationHelpers for better form validation utilities
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
        if (!isEditing && !isAddingNew) {
          setEditedData(data);
        }
      } catch (error) {
        console.error("Error processing skills data:", error);
        setEditedData([]);
      }
    }
  }, [data, setEditedData, isEditing, isAddingNew]);

  // // Handler for toggling edit mode - connects old pattern to new hook
  // const handleEditToggle = () => {
  //   if (isEditing) {
  //     handleSaveSkills();
  //   } else {
  //     startEditing();
  //   }
  // };

  // // Handler for input changes in edit mode
  // const handleSkillInputChange = (
  //   id: string,
  //   field: keyof Skill,
  //   value: any
  // ) => {
  //   handleInputChange(
  //     id,
  //     field,
  //     field === "proficiencyLevel" ? parseInt(value) : value
  //   );

  //   // Use the touchField from useValidationHelpers
  //   touchField(field as string);
  // };

  // // Handler for new skill changes
  // const handleNewSkillChange = (
  //   field: keyof Omit<Skill, "id">,
  //   value: string | number
  // ) => {
  //   handleNewItemChange(field, value);

  //   // Add validation during typing
  //   if (field in values) {
  //     handleChange(field as keyof typeof values, value);
  //   }
  // };

  // // Handler for adding new skill
  // const handleAddNew = () => {
  //   startAddingNew({
  //     id: "new",
  //     name: "",
  //     proficiencyLevel: 3,
  //     category: "Frontend",
  //   } as any);

  //   // Reset form validation
  //   resetForm();
  // };

  // // Handler for canceling add
  // const handleCancelAdd = () => {
  //   cancelAddingNew();
  //   resetForm();
  // };

  // // Handler for saving new skill
  // const handleSaveNewSkill = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Validate form before submission
  //   if (!validateForm()) {
  //     // Mark all fields as touched to show validation errors
  //     Object.keys(values).forEach((key) => {
  //       touchField(key);
  //     });
  //     return;
  //   }

  //   handleSaveNewItem({
  //     event: e,
  //     requiredFields: ["name", "category", "proficiencyLevel"],
  //     formatData: (data) => ({
  //       name: data.name.trim(),
  //       category: data.category.trim(),
  //       proficiencyLevel: parseInt(data.proficiencyLevel.toString()),
  //     }),
  //     endpoint: `/api/users/${userId}/skills`,
  //     onSuccess: () => {
  //       mutate();
  //       resetForm();
  //     },
  //     onError: (error) => {
  //       console.error("Error adding skill:", error);
  //     },
  //   });
  // };

  // // Handler for saving edited skills
  // const handleSaveSkills = () => {
  //   handleSaveEdits({
  //     endpoint: "/api/skills",
  //     onSuccess: () => mutate(),
  //     onError: (error) => {
  //       console.error("Error saving skills:", error);
  //       alert("Failed to save skills. Please try again.");
  //     },
  //   });
  // };

  // // Handler for deleting a skill
  // const handleDeleteSkill = async (id: string) => {
  //   handleDeleteItem({
  //     id,
  //     confirmMessage: "Are you sure you want to delete this skill?",
  //     endpoint: `/api/skills/${id}`,
  //     filterFn: (skill) => skill.id !== id,
  //     onSuccess: () => mutate(),
  //     onError: (error) => {
  //       console.error("Error deleting skill:", error);
  //       alert("Failed to delete skill. Please try again.");
  //     },
  //   });
  // };

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
            {!isAddingNew && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleEditToggle(
                    isEditing,
                    editedData,
                    setIsSubmitting,
                    setIsEditing,
                    setSaveSuccess,
                    mutate,
                    startEditing,
                    setIsAddingNew,
                    handleSaveEdits
                  )
                }
                disabled={isSubmitting}
              >
                <>
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Saving..." : "Done"}
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </>
              </Button>
            )}
          </div>
        </div>

        {/* Add New Skill Form */}
        {isAddingNew && (
          <div className="mb-6 border p-4 rounded-md">
            <h4 className="font-medium mb-3">Add New Skill</h4>
            <form
              onSubmit={(e) =>
                handleSaveNewSkill(
                  e,
                  validateForm,
                  values,
                  touchField,
                  handleSaveNewItem,
                  userId,
                  mutate,
                  resetForm
                )
              }
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
                <Button size="sm" type="submit" disabled={isSubmitting}>
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
                            className="font-medium mb-2"
                            placeholder="Skill Name"
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
                            className="text-sm mb-2"
                            placeholder="Category"
                          />
                          <Input
                            type="number"
                            min="1"
                            max="5"
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
                            className="text-sm"
                            placeholder="Proficiency Level"
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
