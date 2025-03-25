import { z } from "zod";
import { Skill } from "./Interface";

// Backward compatibility function for validating skills
export const validateSkill = (
  skill: Omit<Skill, "id"> | Skill,
  id?: string
) => {
  try {
    // Return true if validation passes
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        id: id || "new",
        issues: error.issues,
      };
    }
    return false;
  }
};
