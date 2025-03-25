// Handler for deleting a skill
export const handleDeleteSkill = (
  id: string,
  handleDeleteItem: (options: any) => Promise<void>,
  mutate: () => void
) => {
  handleDeleteItem({
    id,
    confirmMessage: "Are you sure you want to delete this skill?",
    endpoint: `/api/skills/${id}`,
    filterFn: (skill: any) => skill.id !== id,
    onSuccess: () => {
      mutate();
    },
    onError: (error: any) => {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill. Please try again.");
    },
  });
};
