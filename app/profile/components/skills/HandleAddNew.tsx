// Handler for adding new skill
export const handleAddNew = (
  startAddingNew: (data: any) => void,
  resetForm: () => void
) => {
  startAddingNew([
    {
      id: "new",
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    },
  ]);

  // Reset form validation
  resetForm();
};
