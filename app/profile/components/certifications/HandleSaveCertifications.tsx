// SAVE all edited certifications to the backend
// Updating existing ones
// Called when clicking the "Done" button in edit mode
export const handleSaveCertifications = (
  handleSaveEdits: (options: any) => void,
  mutate: () => void
) => {
  handleSaveEdits({
    endpoint: "/api/certifications",
    dateFields: ["issueDate", "expirationDate"],
    onSuccess: () => mutate(),
    onError: (error: any) => {
      console.error("Error saving certifications:", error);
      alert("Failed to save certifications. Please try again.");
    },
  });
};
