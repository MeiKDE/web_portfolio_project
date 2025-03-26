"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Skill } from "./skills/Interface";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { handleNewSkillChange } from "./skills/HandleNewSkillChange";
import { handleCancelAdd } from "./skills/HandleChancelAdd";
import { handleSaveNewSkill } from "./skills/HandleSaveNewSkill";
import { handleSkillInputChange } from "./skills/HandleSkillInputChange";
import { handleDeleteSkill } from "./skills/HandleDeleteSkill";
import { AddButton } from "./ui/AddButton";
import { EditButton } from "./ui/EditButton";
import { DoneButton } from "./ui/DoneButton";
import { FieldValidation } from "./skills/add_new_skill/Field_Validation";
import { NewSkill } from "./skills/add_new_skill/NewSkill";
import { SkillList } from "./skills/display_skills/SkillList";

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Create a skill object for validation
    const skillToValidate: Skill = {
      id: "", // temporary id for new skill
      name: values.name,
      category: values.category,
      proficiencyLevel: values.proficiencyLevel,
    };

    if (!skillToValidate.name?.trim()) {
      newErrors.name = "Skill name is required";
      isValid = false;
    }

    if (!skillToValidate.category?.trim()) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (
      !skillToValidate.proficiencyLevel ||
      skillToValidate.proficiencyLevel < 1 ||
      skillToValidate.proficiencyLevel > 10
    ) {
      newErrors.proficiencyLevel = "Proficiency level must be between 1 and 10";
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

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      try {
        // Always update editedData when data changes
        setEditedData(data);
      } catch (error) {
        console.error("Error processing skills data:", error);
        setEditedData([]);
      }
    }
  }, [data]); // Only depend on data changes

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

  const handleDeleteItem = async (id: string) => {
    try {
      // Update local state immediately
      setEditedData((prevData) => prevData.filter((skill) => skill.id !== id));

      // Refresh the data from the server
      await mutate();
    } catch (error) {
      console.error("Error refreshing data after deletion:", error);
      // Revert local state if there's an error
      await mutate();
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
              <SkillList
                editedData={editedData}
                isEditing={isEditing}
                handleSkillInputChange={handleSkillInputChange}
                handleInputChange={handleChange}
                touchField={touchField}
                handleDeleteSkill={handleDeleteSkill}
                handleDeleteItem={handleDeleteItem}
                mutate={mutate}
              />
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
