import { Skill } from "@/app/components/Skills/skills.types";

export const skillsService = {
  fetchSkills: async (userId: string): Promise<Skill[]> => {
    const response = await fetch(`/api/users/${userId}/skills`);
    if (!response.ok) {
      throw new Error("Failed to fetch skills");
    }
    return response.json();
  },

  deleteSkill: async (id: string): Promise<void> => {
    const response = await fetch(`/api/skills/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete skill");
    }
  },

  updateSkill: async (
    id: string,
    skill: Skill,
    userId: string
  ): Promise<Skill> => {
    const response = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...skill, userId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update skill");
    }
    return response.json();
  },

  createSkill: async (skill: Skill, userId: string): Promise<Skill> => {
    const response = await fetch(`/api/skills/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...skill, userId }),
    });
    if (!response.ok) {
      throw new Error("Failed to add skill");
    }
    return response.json();
  },
};
