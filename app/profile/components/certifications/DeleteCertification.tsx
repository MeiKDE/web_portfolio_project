// Handler for deleting a certification
export const DeleteCertification = async (
  id: string,
  handleDeleteItem: (id: string) => Promise<void>,
  mutate: () => Promise<any>
) => {
  try {
    console.log("Attempting to delete skill with ID:", id);

    const response = await fetch(`/api/certifications/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      let errorMessage = "Failed to delete skill";
      try {
        const errorData = await response.json();
        console.log("Error response data:", errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    // Call handleDeleteItem to update local state
    await handleDeleteItem(id);

    // Force refresh the data
    await mutate();
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};
