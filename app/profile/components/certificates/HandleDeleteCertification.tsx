// DELETE certification
export const handleDeleteCertification = (
  id: string,
  handleDeleteItem: (options: any) => Promise<void>,
  mutate: () => void
) => {
  handleDeleteItem({
    id,
    confirmMessage: "Are you sure you want to delete this certification?",
    endpoint: `/api/certifications/${id}`,
    filterFn: (cert: any) => cert.id !== id,
    onSuccess: () => {
      mutate();
    },
    onError: (error: any) => {
      console.error("Error deleting certification:", error);
      alert("Failed to delete certification. Please try again.");
    },
  });
};
