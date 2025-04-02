import { Skill } from "@/app/profile/components/Skills/skills.types";
import React from "react";

interface FormValidationProps {
  skill: Skill;
  touchedFields?: Record<string, boolean>;
}

export const FormValidation: React.FC<FormValidationProps> = ({
  skill,
  touchedFields = {},
}) => {
  return (
    <div className="text-sm text-red-500">
      {touchedFields.name && !skill.name && <p>Name is required</p>}
      {touchedFields.category && !skill.category && <p>Category is required</p>}
      {touchedFields.proficiencyLevel &&
        (!skill.proficiencyLevel ||
          skill.proficiencyLevel < 1 ||
          skill.proficiencyLevel > 5) && (
          <p>Proficiency level must be between 1 and 5</p>
        )}
    </div>
  );
};
