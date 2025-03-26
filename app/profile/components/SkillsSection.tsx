"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lightbulb, Edit, Save, Plus, X } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Skill } from "./skills/Interface";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { handleSkillInputChange } from "./skills/HandleSkillInputChange";
import { handleNewSkillChange } from "./skills/HandleNewSkillChange";
import { handleCancelAdd } from "./skills/HandleChancelAdd";
import { handleSaveNewSkill } from "./skills/HandleSaveNewSkill";
import { handleDeleteSkill } from "./skills/HandleDeleteSkill";
import { AddButton } from "./ui/AddButton";
import { EditButton } from "./ui/EditButton";
import { DoneButton } from "./ui/DoneButton";
import { FieldValidation } from "./skills/add_new_skill/Field_Validation";
import { NewSkill } from "./skills/add_new_skill/NewSkill";

interface SkillsProps {
  userId: string;
}

export default function Skills({ userId }: SkillsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editedData, setEditedData] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newItemData, setNewItemData] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [values, setValues] = useState<Record<string, any>>({
    name: "",
    proficiencyLevel: 3,
    category: "Frontend",
  });

  // Fetch skills data
  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/users/${userId}/skills`
  );

  const resetForm = () => {
    setValues({
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    });
    setTouchedFields({});
    setFormErrors({});
  };

  const touchField = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const getInputClassName = (id: string, field: string, baseClass: string) => {
    const hasError = touchedFields[field] && formErrors[field];
    return `${baseClass} ${hasError ? "border-red-500" : ""}`;
  };

  const validateField = (field: string, value: any) => {
    let error = null;
    switch (field) {
      case "name":
        error = !value ? "Skill name is required" : null;
        break;
      case "proficiencyLevel":
        error = value < 1 ? "Proficiency level is required" : null;
        break;
      case "category":
        error = !value ? "Category is required" : null;
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (id: string | null, field: string, value: any) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      return prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
    });

    // Validate field if it's been touched
    if (touchedFields[field]) {
      const error = validateField(field, value);
      setFormErrors((prev) => ({
        ...prev,
        [field]: error || "",
      }));
    }
  };

  // const handleBlur = (field: string) => {
  //   setTouchedFields((prev) => ({ ...prev, [field]: true }));
  //   const item = editedData.find((item) => item.id === "new");
  //   if (item) {
  //     const error = validateField(field, item[field as keyof Skill]);
  //     setFormErrors((prev) => ({
  //       ...prev,
  //       [field]: error || "",
  //     }));
  //   }
  // };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!values.name?.trim()) {
      newErrors.name = "Skill name is required";
      isValid = false;
    }

    if (!values.category?.trim()) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (
      !values.proficiencyLevel ||
      values.proficiencyLevel < 1 ||
      values.proficiencyLevel > 5
    ) {
      newErrors.proficiencyLevel = "Proficiency level must be between 1 and 5";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setNewItemData(null);
    setFormErrors({});
    setTouchedFields({});
  };

  const handleDeleteItem = async ({
    id,
    confirmMessage,
    endpoint,
    filterFn,
    onSuccess,
    onError,
  }: {
    id: string;
    confirmMessage?: string;
    endpoint: string;
    filterFn?: (item: any) => boolean;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    if (confirmMessage && !confirm(confirmMessage)) return;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to delete item: ${errorData.error || response.statusText}`
        );
      }

      if (Array.isArray(editedData) && filterFn) {
        setEditedData(editedData.filter(filterFn));
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error deleting item:", error);
      onError?.(error);
    }
  };

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
      resetForm: !!resetForm,
    });
  }, [isAddingNew, resetForm]);

  // Add useEffect to sync newItemData with values
  useEffect(() => {
    if (isAddingNew && !newItemData) {
      setNewItemData({
        name: "",
        proficiencyLevel: 3,
        category: "Frontend",
      });
    }
  }, [isAddingNew, newItemData]);

  const onClickAddNew = () => {
    setIsAddingNew(true);
    setNewItemData({
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    });
    setValues({
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    });
    setFormErrors({});
  };

  const onClickDone = () => {
    handleSaveEdits({
      endpoint: `/api/skills`,
      validateFn: (data) => {
        try {
          // Validate each skill
          if (Array.isArray(data)) {
            data.forEach((skill) => {
              if (!skill.name || !skill.category || !skill.proficiencyLevel) {
                throw new Error("All required fields must be filled");
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
    });
  };

  const onClickEdit = () => {
    if (data) {
      setIsEditing(true);
      setEditedData(data);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveEdits = async ({
    endpoint,
    validateFn,
    onSuccess,
    onError,
  }: {
    endpoint: string;
    validateFn?: (data: any) => boolean | string | null;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    try {
      if (validateFn && editedData) {
        const validationResult = validateFn(editedData);
        if (validationResult !== true && validationResult !== null) {
          onError?.(new Error(`Validation failed: ${validationResult}`));
          return;
        }
      }

      setIsSubmitting(true);

      if (!editedData) {
        console.warn("No data to update");
        return;
      }

      const itemsToUpdate = Array.isArray(editedData)
        ? editedData
        : [editedData];

      for (const item of itemsToUpdate) {
        const response = await fetch(`${endpoint}/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to update item: ${errorData.error || response.statusText}`
          );
        }
      }

      setIsEditing(false);
      setSaveSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving changes:", error);
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading skill information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
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

        {/* Add validation error messages */}
        {isEditing &&
          editedData?.map((skill, index) => (
            <FieldValidation key={skill.id} skill={skill} />
          ))}

        {/* Add New Skill Entry */}
        {isAddingNew && (
          <NewSkill
            userId={userId}
            values={values}
            formErrors={formErrors}
            newItemData={newItemData}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            touchField={touchField}
            getInputClassName={getInputClassName}
            handleNewSkillChange={handleNewSkillChange}
            handleCancelAdd={handleCancelAdd}
            handleSaveNewSkill={handleSaveNewSkill}
            setNewItemData={setNewItemData}
            mutate={mutate}
            resetForm={resetForm}
            cancelAddingNew={cancelAddingNew}
            validateForm={validateForm}
            setIsSubmitting={setIsSubmitting}
            setSaveSuccess={setSaveSuccess}
            setIsAddingNew={setIsAddingNew}
          />
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
