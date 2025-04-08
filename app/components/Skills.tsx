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
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [formData, setFormData] = useState<Skill[]>([]);
  const [changedSkillId, setChangedSkillId] = useState<Set<string>>(new Set());
  const [isSkillValidMap, setIsSkillValidMap] = useState<Map<string, boolean>>(
    new Map()
  );
  // This is used to fetch the skills data from the database
  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/users/${userId}/skills`
  );

  useEffect(() => {
    if (data) {
      setSkillsData(data);
      setFormData(data);
    }
  }, [data]);

  // This is used to add a new skill
  const onAddNewSkill = () => setIsAddingNewItem(true);

  // Delete a skill by id
  const onDeleteSkillList = async (id: string | null) => {
    try {
      console.log("Deleting skill:", id);

      setIsSubmittingItem(true);

      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }

      const data = await response.json();
      console.log("data", data);
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Error deleting skill");
    } finally {
      mutate(); // Refresh the data thus re-fetches the skills data by calling the useFetchData hook again
      setIsSubmittingItem(false);
    }
  };

  const updateSkill = async (id: string, skillObject: Skill) => {
    const response = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: skillObject.name,
        category: skillObject.category,
        proficiencyLevel: skillObject.proficiencyLevel,
      }),
    });
  };

  // Update a skill by id
  const onUpdateSkillList = async () => {
    setIsSubmittingItem(true);
    setIsEditingMode(true);

    try {
      // Convert edited data array to an object
      formData.forEach((skill) => {
        if (changedSkillId.has(skill.id)) {
          updateSkill(skill.id, skill);
        }
      });
    } catch (error) {
      console.error("Error updating skills:", error);
      // You might want to show an error message to the user here
      toast.error("Error updating skills");
    } finally {
      mutate();
      setIsSubmittingItem(false);
      setIsEditingMode(false);
    }
  };

  // console.log("data", data);

  const onSaveNewSkill = async (skillObject: Skill) => {
    try {
      setIsSubmittingItem(true);
      setIsAddingNewItem(false);

      const response = await fetch(`/api/skills/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillObject),
      });

      if (!response.ok) {
        throw new Error("Failed to add skill");
      }

      const data = await response.json();
      console.log("data", data);
      toast.success("Skill added successfully");

      setIsSubmittingItem(false);
    } catch (error) {
      console.error("Error adding new skill:", error);
      toast.error("Error adding new skill");
    } finally {
      mutate(); // Refresh the data
      setIsSubmittingItem(false);
    }
  };

  const onSkillChange = (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => {
    setFormData((prev) => {
      return prev.map((skill) => {
        setIsSkillValidMap((prev) => {
          prev.set(id, isFormValid);
          return prev;
        });
        if (skill.id === id) {
          setChangedSkillId((prev) => {
            prev.add(id);
            return prev;
          });
          return { ...skill, [field]: value };
        }
        return skill;
      });
    });
  };

  let SkillItemContent;
  let SkillFormContent;

  if (!isEditingMode) {
    SkillItemContent = (
      <>
        {!isLoading &&
          !error &&
          skillsData &&
          skillsData.length > 0 &&
          skillsData.map((skill: Skill) => (
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
        {formData.map((skill: Skill) => (
          <div key={skill.id}>
            <SkillForm
              onFormChange={onSkillChange}
              skill={skill}
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
            {!isAddingNewItem && !isEditingMode && (
              <AddButton onClick={onAddNewSkill} />
            )}
            {/* if isAddingNewItem is false and if isEditingMode is false, then the Edit button will be shown */}
            {!isAddingNewItem && !isEditingMode && (
              <EditButton
                onClick={() => {
                  setIsEditingMode(true);
                }}
              />
            )}
            {/* if isEditingMode is true, then the Done button will be shown */}
            {isEditingMode && (
              <DoneButton
                onClick={onUpdateSkillList}
                isSubmitting={isSubmittingItem} //defaults to false
                disabled={!isSkillValidMap.values().every((isValid) => isValid)}
              >
                {isSubmittingItem ? "Saving..." : "Done"}
                {isSubmittingItem && (
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
        {isAddingNewItem && (
          <NewSkill userId={userId} onSaveNewSkill={onSaveNewSkill} />
        )}

        {/* if isEditingMode is false, then the SkillItem component will be shown */}
        {/* else, then the SkillForm component will be shown */}
        {SkillItemContent}
        {SkillFormContent}
      </CardContent>
    </Card>
  );
}
