"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skill } from "@/app/components/Skills/skills.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewSkill } from "@/app/components/Skills/NewSkill";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import { SkillItem } from "./Skills/List/SkillItem";
import { SkillForm } from "./Skills/List/SkillForm";

interface SkillsProps {
  userId: string; // This is mapped to session.user.id from page.tsx
}

export default function Skills({ userId }: SkillsProps) {
  const [mode, setMode] = useState<"view" | "edit" | "add">("view");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<{
    data: Skill[];
    edited: Record<string, Skill>;
    validation: Record<string, boolean>;
  }>({
    data: [],
    edited: {},
    validation: {},
  });

  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/users/${userId}/skills`
  );

  console.log("data", data);

  // Debugging purposes
  useEffect(() => {
    console.log("Current userId:", userId);
    console.log("Received skills data:", data);
  }, [userId, data]);

  /*
  Purpose:  This code runs automatically when either:
  - New data arrives (probably a list of skills)
  - Or when the mode changes (like switching into "edit mode")
  */
  useEffect(() => {
    if (data) {
      // These are functions — not values — that are used later inside:
      // if prev.edited is missing, it just uses an empty object instead of undefined.
      // These functions are just ways to say: "Use the old values...
      // unless we're in edit mode." If the old values aren't there yet,
      // the app might store {} to default to empty objects.
      let edited = (prev: any) => prev.edited ?? {};
      let validation = (prev: any) => prev.validation ?? {};

      // Think Reduce as: I have a list,
      // and I want to turn it into a single thing by going through it one item at a time.
      //That "thing" could be an array, object, number — anything. In your case,
      // it’s an object with two parts: editedMap and validationMap.
      if (mode === "edit") {
        const { editedMap, validationMap } = data.reduce<{
          editedMap: Record<string, Skill>;
          validationMap: Record<string, boolean>;
        }>(
          // Skill is the current skill we're looping over — just one item from the data array.
          // acc is short for "accumulator" — it's the object we’re building up with each step.
          // It's like a snowball that keeps growing as we go through the list.

          // Let's say the data looks like this:
          // [
          //   { id: "1", name: "Skill 1" },
          //   { id: "2", name: "Skill 2" },
          //   { id: "3", name: "Skill 3" },
          // ]

          // then
          // acc.editedMap["1"] = { id: "1", name: "Skill 1" };
          // acc.validationMap["1"] = true;

          // acc.editedMap["2"] = { id: "2", name: "Skill 2" };
          // acc.validationMap["2"] = true;

          // acc.editedMap["3"] = { id: "3", name: "Skill 3" };
          // acc.validationMap["3"] = true;

          // now acc becomes:
          // {
          //   editedMap: {
          //     "1": { id: "1", name: "Skill 1" },
          //     "2": { id: "2", name: "Skill 2" },
          //     "3": { id: "3", name: "Skill 3" },
          //   },
          //   validationMap: {
          //     "1": true,
          //     "2": true,
          //     "3": true,
          //   },
          // }

          (acc, skill) => {
            acc.editedMap[skill.id] = skill;
            acc.validationMap[skill.id] = true;
            return acc;
          },

          // This is the initial value of acc.
          // It's an object with two empty maps: editedMap and validationMap.
          { editedMap: {}, validationMap: {} }
        );
        // If in edit mode, use these new maps we just built.
        edited = () => editedMap;
        validation = () => validationMap;
      }

      // Now we update the state with the new maps.
      // This is like saying: "Hey, here's the new editedMap and validationMap."
      // It's like a snapshot of the maps at this moment.

      setSkills((prev) => ({
        ...prev,
        data,
        edited: edited(prev),
        validation: validation(prev),
      }));
    }
  }, [data, mode]);

  // Updates the skills state —
  // specifically the edited and validation parts — using setSkills.
  const onSkillChange = (
    id: string,
    field: string,
    value: string | number, // Updated type to handle proficiencyLevel
    isFormValid: boolean
  ) => {
    setSkills((prev) => ({
      ...prev,
      edited: {
        ...prev.edited, //Take the current edited skills
        [id]: {
          //update the one with the matching id
          ...(prev.edited[id] || prev.data.find((s) => s.id === id) || {}),
          [field]: field === "proficiencyLevel" ? Number(value) : value,
        } as Skill, // Type assertion to ensure correct typing
      },
      //This just updates whether the specific skill's form is valid or not.
      //Let’s say you filled in the form correctly — then it might set:
      // validation["1"] = true;
      validation: {
        ...prev.validation,
        [id]: isFormValid,
      },
    }));
  };

  // Update your render logic
  const isEditMode = mode === "edit";
  const isAddingNew = mode === "add";
  const hasValidationErrors = Object.values(skills.validation).some((v) => !v);

  // This is used to add a new skill
  const onAddNewSkill = () => setMode("add");

  // Delete a skill by id
  const onDeleteSkillList = async (id: string | null) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }

      toast.success("Skill deleted successfully");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Error deleting skill");
    } finally {
      mutate();
      setIsSubmitting(false);
    }
  };

  const updateSkill = async (id: string, skillObject: Skill) => {
    const response = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...skillObject,
        userId, // Include userId in the request
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update skill");
    }

    return response.json();
  };

  // Update a skill by id
  const onUpdateSkillList = async () => {
    setIsSubmitting(true);

    try {
      // Process all edited skills in parallel and wait for all to complete
      await Promise.all(
        Object.entries(skills.edited).map(([id, skill]) =>
          updateSkill(id, skill)
        )
      );

      toast.success("Skills updated successfully");

      // Clear edited state after successful update
      setSkills((prev) => ({
        ...prev,
        edited: {},
        validation: {},
      }));

      // Only change mode after everything is complete
      setMode("view");
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Error updating skills");
    } finally {
      mutate();
      setIsSubmitting(false);
    }
  };

  // console.log("data", data);

  const onSaveNewSkill = async (skillObject: Skill) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/skills/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...skillObject,
          userId, // Include userId in the request
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add skill");
      }

      toast.success("Skill added successfully");
      setMode("view");
    } catch (error) {
      console.error("Error adding new skill:", error);
      toast.error("Error adding new skill");
    } finally {
      mutate();
      setIsSubmitting(false);
    }
  };

  // Add this function after the other handlers
  const onCancelHandler = () => {
    setMode("view");
  };

  let SkillItemContent;
  let SkillFormContent;

  if (!isEditMode) {
    SkillItemContent = (
      <>
        {!isLoading &&
          !error &&
          skills.data &&
          skills.data.length > 0 &&
          skills.data.map((skill: Skill) => (
            <div
              key={skill.id}
              className="relative border-b pb-4 last:border-0"
            >
              <SkillItem skill={skill} />
            </div>
          ))}
      </>
    );
  } else {
    SkillFormContent = (
      <>
        {skills.data.map((skill: Skill) => (
          <div key={skill.id}>
            <SkillForm
              onFormChange={onSkillChange}
              skill={skills.edited[skill.id] || skill}
              onDeleteClick={onDeleteSkillList}
            />
          </div>
        ))}
      </>
    );
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading skills information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
          <div className="flex gap-2">
            {/* if isAddingNewItem is false and if isEditingMode is false, then the Add button will be shown */}
            {!isAddingNew && !isEditMode && (
              <AddButton onClick={onAddNewSkill} />
            )}
            {/* if isAddingNewItem is false and if isEditingMode is false, then the Edit button will be shown */}
            {!isAddingNew && !isEditMode && (
              <EditButton
                onClick={() => {
                  setMode("edit");
                }}
              />
            )}
            {/* if isEditingMode is true, then the Done button will be shown */}
            {isEditMode && (
              <DoneButton
                onClick={onUpdateSkillList}
                isSubmitting={isSubmitting} //defaults to false
                disabled={hasValidationErrors}
              >
                {isSubmitting ? "Saving..." : "Done"}
                {isSubmitting && (
                  <span className="ml-2 inline-block">
                    <LoadingSpinner size="sm" text="" />
                  </span>
                )}
              </DoneButton>
            )}
          </div>
        </div>

        {/* Add New Skill Entry */}
        {/* if isAddingNewItem is true, then the NewSkill component will be shown */}
        {isAddingNew && (
          <NewSkill
            userId={userId}
            onSaveNewSkill={onSaveNewSkill}
            onCancel={onCancelHandler}
          />
        )}

        {/* if isEditingMode is false, then the SkillItem component will be shown */}
        {/* else, then the SkillForm component will be shown */}
        {SkillItemContent}
        {SkillFormContent}
      </CardContent>
    </Card>
  );
}
