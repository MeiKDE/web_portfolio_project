import { Skill } from "@/app/profile/components/Skills/Interface";
import { useState, useEffect } from "react";
import { SkillItem } from "@/app/profile/components/Skills/List/skillItem";
import React, { JSX } from "react";
import { SkillForm } from "@/app/profile/components/Skills/List/skillForm";

interface SkillListProps {
  editedData: Skill[];
  isEditing: boolean;
  mutate: () => Promise<any>;
  userId: string;
  onDeleteSkillList: (id: string) => void;
}

export function SkillList({
  editedData,
  isEditing,
  mutate,
  userId,
  onDeleteSkillList,
}: SkillListProps) {
  const onDeleteClick = (id: string) => {
    console.log(id);
    setIsDeleting(id);
    mutate(); // Refetch the data
  };

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Display the list of skills */}
      {editedData.map((skill: Skill) => (
        <div key={skill.id} className="relative border-b pb-4 last:border-0">
          {/* If the user is editing the skill, show the skill form */}
          {isEditing ? (
            <SkillForm
              skill={{
                ...skill,
                category: skill.category || "",
                proficiencyLevel: skill.proficiencyLevel || 1,
              }}
              onDeleteClick={onDeleteSkillList}
              isDeleting={isDeleting}
            />
          ) : (
            //If the user is not editing the skill, show the skill item
            <SkillItem skill={skill} />
          )}
        </div>
      ))}
    </div>
  );
}
