// Add console logs to debug
export const handleCancelAdd = (
  cancelAddingNew: () => void,
  resetForm: () => void
) => {
  console.log("handleCancelAdd called");
  console.log("cancelAddingNew:", !!cancelAddingNew);
  console.log("resetForm:", !!resetForm);

  try {
    cancelAddingNew();
    console.log("cancelAddingNew executed");

    resetForm();
    console.log("resetForm executed");
  } catch (error) {
    console.error("Error in handleCancelAdd:", error);
  }
};
