import { Skill } from "../Interface";
import { successResponse, errorResponse } from "@/app/lib/api/api-helpers";
import { handleApiError } from "@/app/lib/api/error-handler";

interface FormValidationProps {
  skill: Skill;
  touchedFields?: Record<string, boolean>;
}

// Add a validation function that can be exported
export const validateSkill = (
  skill: Skill
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  if (!skill.name) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (!skill.category) {
    errors.category = "Category is required";
    isValid = false;
  }

  if (
    !skill.proficiencyLevel ||
    skill.proficiencyLevel < 1 ||
    skill.proficiencyLevel > 5
  ) {
    errors.proficiencyLevel = "Proficiency level must be between 1 and 5";
    isValid = false;
  }

  return { isValid, errors };
};

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
          skill.proficiencyLevel > 5) && (
          <p>Proficiency level must be between 1 and 5</p>
        )}
    </div>
  );
};
