// Handler for saving edited skills
export const handleSaveSkills = (
  handleSaveEdits: Function,
  mutate: () => void
) => {
  handleSaveEdits({
    endpoint: `/api/skills`,
    onSuccess: () => {
      mutate();
    },
    onError: (error: any) => {
      console.error("Error saving skills:", error);
      alert("Failed to save skills. Please try again.");
    },
  });
};
