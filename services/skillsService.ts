import { Skill } from "@/app/components/Skills/skills.types";

export const skillsService = {
  async deleteSkill(id: string) {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error deleting skill: ${error}`);
    }
  },

  async updateSkill(id: string, skill: Skill) {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: skill.name,
          category: skill.category,
          proficiencyLevel: skill.proficiencyLevel,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update skill");
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error updating skill: ${error}`);
    }
  },

  async createSkill(skill: Skill) {
    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skill),
      });

      if (!response.ok) {
        throw new Error("Failed to create skill");
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error creating skill: ${error}`);
    }
  },
};
