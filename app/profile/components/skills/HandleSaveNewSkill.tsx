export const handleSaveNewSkill = (
  e: React.FormEvent,
  validateForm: () => boolean,
  values: any,
  touchField: (field: string) => void,
  handleSaveNewItem: any,
  userId: string,
  mutate: () => void,
  resetForm: () => void
) => {
  e.preventDefault();

  // Validate form before submission
  if (!validateForm()) {
    // Mark all fields as touched to show validation errors
    Object.keys(values).forEach((key) => {
      touchField(key);
    });
    return;
  }

  handleSaveNewItem({
    event: e,
    requiredFields: ["name", "category", "proficiencyLevel"],
    formatData: (data: any) => ({
      name: data.name.trim(),
      category: data.category.trim(),
      proficiencyLevel: parseInt(data.proficiencyLevel.toString()),
    }),
    endpoint: `/api/users/${userId}/skills`,
    onSuccess: () => {
      mutate();
      resetForm();
    },
    onError: (error: any) => {
      console.error("Error adding skill:", error);
    },
  });
};
