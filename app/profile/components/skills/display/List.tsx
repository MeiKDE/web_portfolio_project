import { Skill } from "@/app/profile/components/skills/Interface";
import { useState, useEffect } from "react";
import { DeleteSkill } from "@/app/profile/components/skills/DeleteSkill";
import { NameInput } from "@/app/profile/components/skills/display/child/list/nameInput";
import { CategoryInput } from "@/app/profile/components/skills/display/child/list/categoryInput";
import { ProficiencyInput } from "@/app/profile/components/skills/display/child/list/proficiencyInput";
import { DeleteButton } from "@/app/profile/components/ui/DeleteBtn";
import { SkillsList } from "@/app/profile/components/skills/display/child/list/skillsList";

interface SkillListProps {
  editedData: Skill[];
  isEditing: boolean;
  mutate: () => Promise<any>;
}

export function SkillList({ editedData, isEditing, mutate }: SkillListProps) {
  const [localData, setLocalData] = useState<Skill[]>(editedData);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  console.log("isEditing", isEditing);

  // This state is important as it takes editedData set as localData
  useEffect(() => {
    setLocalData(editedData);
  }, [editedData]);

  // Delete item from the localData
  const deleteItemFromLocalState = async (id: string) => {
    try {
      // prev is the previous state of the localData
      // filter is used to remove the item with the id that is being deleted
      setLocalData((prev) => prev.filter((skill) => skill.id !== id));
      return Promise.resolve(); // success
    } catch (error) {
      console.error("Error deleting item:", error);
      return Promise.reject(error); // error
    }
  };

  // Delete item from the database
  const deleteItemFromDatabase = async (id: string) => {
    try {
      await DeleteSkill(id, deleteItemFromLocalState, mutate);
    } catch (error) {
      console.error("Error deleting item from database:", error);
    }
  };

  // Delete button function
  const onDeleteClick = async (skillId: string) => {
    try {
      setIsDeleting(skillId);
      await deleteItemFromDatabase(skillId);
    } catch (error) {
      console.error("Error in onDeleteClick button:", error);
      alert("Failed to delete skill. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const skillInputChange = (id: string, field: string, value: any) => {
    setLocalData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="space-y-4">
      {localData.map((skill: Skill) => (
        <div key={skill.id} className="relative border-b pb-4 last:border-0">
          {/* Skill content - editable or readonly */}
          {isEditing ? (
            <div className="flex gap-2">
              <div className="w-full">
                <NameInput skill={skill} skillInputChange={skillInputChange} />
                <CategoryInput
                  skill={skill}
                  skillInputChange={skillInputChange}
                />
                <ProficiencyInput
                  skill={skill}
                  skillInputChange={skillInputChange}
                />
              </div>
              <div className="flex items-start">
                <DeleteButton
                  onDeleteClick={onDeleteClick}
                  isDeleting={isDeleting}
                  skillId={skill.id}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <SkillsList skill={skill} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
