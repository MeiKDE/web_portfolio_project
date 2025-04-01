// Handler for deleting a skill
export const DeleteSkill = async (
  id: string,
  handleDeleteItem: (id: string) => Promise<void>,
  mutate: () => Promise<any>
) => {
  try {
    const response = await fetch(`/api/skills/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete skill");
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
