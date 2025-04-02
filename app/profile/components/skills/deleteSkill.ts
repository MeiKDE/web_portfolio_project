// Handler for deleting a skill
export const deleteSkill = async (
  id: string,
  userId: string,
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
      body: JSON.stringify({ userId }),
    });

    console.log("ln16: response", response);
    console.log("ln17: userId", userId);
    console.log("ln18: id", id);

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
