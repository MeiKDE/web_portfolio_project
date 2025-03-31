"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Skill } from "./skills/Interface";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "./ui/AddButton";
import { EditButton } from "./ui/EditButton";
import { DoneButton } from "./ui/DoneButton";
import { FormValidation } from "./skills/add/child/new-skill/FormValidation";
import { NewSkill } from "./skills/add/NewSkill";
import { SkillList } from "./skills/display/List";

interface SkillsProps {
  userId: string;
}

export default function Skills({ userId }: SkillsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editedData, setEditedData] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [values, setValues] = useState<Record<string, any>>({
    name: "",
    proficiencyLevel: 3,
    category: "Frontend",
  });

  // Fetch skills data
  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/users/${userId}/skills`
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      try {
        // Always update editedData when data changes
        console.log("refreshed data", data);
        setEditedData(data);
      } catch (error) {
        console.error("Error processing skills data:", error);
        setEditedData([]);
      }
    }
  }, [data]); // Depends on data change

  //this is used to refresh the data after saving a new skill
  // setting saveSuccess to false will trigger this useEffect
  // saveSuccess is set to false when the data is refreshed
  //isSubmitting is set to false when the data is refreshed
  //isAddingNew is set to false when the data is refreshed
  useEffect(() => {
    if (saveSuccess) {
      const refreshData = async () => {
        await mutate();
        setSaveSuccess(false);
        setIsSubmitting(false);
        setIsAddingNew(false); // This will hide the form
      };
      refreshData();
    }
  }, [saveSuccess, mutate]);

  const onClickAddNew = () => {
    setIsAddingNew(true);
    setValues({
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    });
  };

  const onClickDone = () => {
    handleSaveEdits({
      endpoint: `/api/skills`,
      validateFn: (data: any) => {
        setEditedData(data); // added this line to set the editedData to the data
        return true;
      },
      onSuccess: () => {
        mutate(); // refresh the data
        setIsEditing(false); // to false because the data is not being edited
        setSaveSuccess(true); // to true because the data is saved successfully
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

  // this is used to save and update the data
  const handleSaveEdits = async ({
    endpoint,
    validateFn, // returns true if the data is valid
    onSuccess, // called when the data is saved successfully
    onError, // called when the data is not saved successfully
  }: {
    endpoint: string;
    validateFn?: (data: any) => boolean | string | null;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    try {
      if (validateFn && editedData) {
        console.log("if validateFn && editedData", validateFn, editedData);
        const validationResult = validateFn(editedData); // validate the data

        // if the data is not valid, call the onError function
        if (validationResult !== true && validationResult !== null) {
          onError?.(new Error(`Validation failed: ${validationResult}`));
          return;
        }
      }
      // setting to true because the data is being updated
      // and will trigger the useEffect that refreshes the data
      setIsSubmitting(true);

      // if there is no data to update
      if (!editedData) {
        console.warn("No data to update");
        return;
      }

      // if the data is an array, use the array
      // if the data is not an array, make it an array
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
        console.log("ln150: response", response);
        // update the data
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to update item: ${errorData.error || response.statusText}`
          );
        }
      }
      // reset the form after saving the data
      onSuccess?.(); // call the onSuccess function to refresh the data
    } catch (error) {
      console.error("Error saving changes:", error);
      onError?.(error); // call the onError function to display an error message
    } finally {
      setIsSubmitting(false); // to false because the data is not being updated
    }
  };

  const onSave = async () => {
    console.log("onSave function called");
    setIsAddingNew(false);
    console.log("setIsAddingNew");
    await mutate(); // refresh the data
    console.log("mutate");
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
            <FormValidation key={skill.id} skill={skill} />
          ))}

        {/* Add New Skill Entry */}
        {isAddingNew && <NewSkill userId={userId} onSave={onSave} />}

        {/* Skills List */}
        {!isLoading && !error && (
          <>
            {editedData && editedData.length > 0 ? (
              <SkillList
                editedData={editedData}
                isEditing={isEditing}
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
