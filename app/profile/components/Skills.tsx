"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skill } from "./Skills/Interface";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "./ui/AddButton";
import { EditButton } from "./ui/EditButton";
import { DoneButton } from "./ui/DoneButton";
import { NewSkill } from "@/app/profile/components/Skills/NewSkill";
import { SkillList } from "@/app/profile/components/Skills/List";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";

interface SkillsProps {
  userId: string; // This is mapped to session.user.id from page.tsx
}

export default function Skills({ userId }: SkillsProps) {
  const defaultSkillValues = {
    name: "",
    proficiencyLevel: 3,
    category: "Frontend",
  };
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [values, setValues] = useState(defaultSkillValues);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedData, setEditedData] = useState<Skill[]>([]);

  const isDeleting = !isAddingNew;

  const onClickAddNew = () => {
    setIsAddingNew(true);
    setValues(values);
  };

  const onDeleteSkillList = async (id: string | null) => {
    setIsEditing(true);
    setIsAddingNew(false);

    const response = await fetch(`/api/skills/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("data", data);
    mutate();
  };

  const onUpdateSkillList = async () => {
    setIsSubmitting(true);
    setIsEditing(false);
    setIsAddingNew(false);

    try {
      // Convert edited data array to an object
      const formattedSkills = editedData.map((skill) => ({
        name: skill.name,
        category: skill.category || "General",
        proficiencyLevel: skill.proficiencyLevel || 1,
      }));

      const response = await fetch(`/api/skills/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedSkills),
      });

      const data = await response.json();
      console.log("Skills updated successfully:", data);
      mutate();
    } catch (error) {
      console.error("Error updating skills:", error);
      // You might want to show an error message to the user here
      toast.error("Error updating skills");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/skills/${userId}`
  );

  // console.log("data", data);

  const onSaveNewSkill = async (values: Skill) => {
    setIsSubmitting(true);
    setIsAddingNew(false);

    const response = await fetch(`/api/skills/`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();
    console.log("data", data);
    mutate();
  };

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading skills information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
          <div className="flex gap-2">
            {/* When not adding or editing, the Add button will be shown */}
            {!isAddingNew && !isEditing && (
              <AddButton onClick={onClickAddNew} />
            )}
            {/* When editing, the Done button will be shown */}
            {isEditing ? (
              <DoneButton
                onClick={onUpdateSkillList}
                isSubmitting={isSubmitting}
              />
            ) : (
              /* When not editing, the Edit button will be shown */
              isDeleting && (
                <>
                  <EditButton
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  />
                </>
              )
            )}
          </div>
        </div>

        {/* Add New Skill Entry */}
        {isAddingNew && (
          <NewSkill userId={userId} onSaveNewSkill={onSaveNewSkill} />
        )}

        {/* Display Skills List when not loading or error */}
        {!isLoading && !error && (
          <>
            {editedData && editedData.length > 0 ? (
              <SkillList
                //Filter the skills to only include the skills for the current user
                editedData={editedData.filter(
                  (skill) => skill.userId === userId
                )}
                onDeleteSkillList={onDeleteSkillList}
                isEditing={isEditing} // Whether the user is editing the skill
                mutate={mutate} // Refresh the data
                userId={userId} // The user ID of the current user
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
