import { Skill } from "../Interface";

interface FieldValidationProps {
  skill: Skill;
}

export const FieldValidation = ({ skill }: FieldValidationProps) => {
  return (
    <div key={skill.id} className="text-sm text-red-500">
      {!skill.name && <p>Name is required</p>}
      {!skill.category && <p>Category is required</p>}
      {(!skill.proficiencyLevel ||
        skill.proficiencyLevel < 1 ||
        skill.proficiencyLevel > 10) && (
        <p>Proficiency level must be between 1 and 10</p>
      )}
    </div>
  );
};
