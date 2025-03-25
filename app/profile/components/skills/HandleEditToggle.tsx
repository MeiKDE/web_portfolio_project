import { Skill } from "./Interface";

// Export function that takes all the required arguments
export const handleEditToggle = (
  isEditing: boolean,
  editedData: Skill[] | null,
  setIsSubmitting: (value: boolean) => void,
  setIsEditing: (value: boolean) => void,
  setSaveSuccess: (value: boolean) => void,
  mutate: () => void,
  startEditing: () => void,
  setIsAddingNew: (value: boolean) => void,
  handleSaveEdits: Function
) => {
  if (isEditing) {
    handleSaveEdits({
      endpoint: "/api/skills",
      onSuccess: () => mutate(),
      onError: (error: any) => {
        console.error("Error saving skills:", error);
        alert("Failed to save skills. Please try again.");
      },
    });
  } else {
    startEditing();
    setIsAddingNew(false);
  }
};
