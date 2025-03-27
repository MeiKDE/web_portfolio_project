import { Skill } from "../Interface";

interface FormValidationProps {
  skill: Skill;
  touchedFields?: Record<string, boolean>;
}

export const FormValidation = ({
  skill,
  touchedFields = {},
}: FormValidationProps) => {
  return (
    <div className="text-sm text-red-500">
      {touchedFields.name && !skill.name && <p>Name is required</p>}
      {touchedFields.category && !skill.category && <p>Category is required</p>}
      {touchedFields.proficiencyLevel &&
        (!skill.proficiencyLevel ||
          skill.proficiencyLevel < 1 ||
          skill.proficiencyLevel > 10) && (
          <p>Proficiency level must be between 1 and 10</p>
        )}
    </div>
  );
};
