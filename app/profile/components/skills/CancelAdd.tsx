// Add console logs to debug
export const CancelAdd = (
  cancelAddingNew: () => void,
  resetForm: () => void
) => {
  console.log("CancelAdd called");
  console.log("cancelAddingNew:", !!cancelAddingNew);
  console.log("resetForm:", !!resetForm);

  try {
    cancelAddingNew();
    console.log("cancelAddingNew executed");

    resetForm();
    console.log("resetForm executed");
  } catch (error) {
    console.error("Error in CancelAdd:", error);
  }
};
