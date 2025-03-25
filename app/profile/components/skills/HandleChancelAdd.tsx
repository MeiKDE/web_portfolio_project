// Handler for canceling add
export const handleCancelAdd = (
  cancelAddingNew: () => void,
  resetForm: () => void
) => {
  cancelAddingNew();
  resetForm();
};
