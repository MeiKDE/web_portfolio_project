import { saveChanges } from "./SaveChanges";
import { Certification } from "./Interface";

// Toggle edit mode
export const handleEditToggle = (
  isEditing: boolean,
  editedData: Certification[] | null,
  setIsSubmitting: (isSubmitting: boolean) => void,
  setIsEditing: (isEditing: boolean) => void,
  setSaveSuccess: (saveSuccess: boolean) => void,
  mutate: () => void,
  startEditing: () => void,
  setIsAddingNew: (isAddingNew: boolean) => void
) => {
  if (isEditing) {
    // Call saveChanges with only the 5 required arguments
    saveChanges(
      editedData,
      setIsSubmitting,
      setIsEditing,
      setSaveSuccess,
      mutate
    );
  } else {
    startEditing();
    setIsAddingNew(false); // Ensure add form is closed
  }
};
