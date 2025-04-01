import { Skill } from "@/app/profile/components/skills/Interface";
import { useState, useEffect } from "react";
import { SkillsList } from "@/app/profile/components/skills/display/child/list/skillsList";
import React from "react";
import { SkillForm } from "@/app/profile/components/skills/display/child/list/skillForm";

interface SkillListProps {
  editedData: Skill[];
  isEditing: boolean;
  mutate: () => Promise<any>;
  userId: string;
}

export function SkillList({
  editedData,
  isEditing,
  mutate,
  userId,
}: SkillListProps) {
  const onDeleteClick = (id: string) => {
    console.log(id);
    setIsDeleting(id);
    mutate(); // Refetch the data
  };

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {editedData.map((skill: Skill) => (
        <div key={skill.id} className="relative border-b pb-4 last:border-0">
          {/* Skill content - editable or readonly */}
          {isEditing ? (
            <SkillForm
              skill={{
                ...skill,
                category: skill.category || "",
                proficiencyLevel: skill.proficiencyLevel || 1,
              }}
              onDeleteClick={onDeleteClick}
              isDeleting={isDeleting}
            />
          ) : (
            <SkillsList skill={skill} />
          )}
        </div>
      ))}
    </div>
  );
}
