// Handler for input changes in edit mode
export const SkillInputChange = <T extends string>(
  id: string,
  field: T,
  value: any,
  handleInputChange: (id: string, field: string, value: any) => void
) => {
  // Process number values
  const processedValue =
    field === "proficiencyLevel" && typeof value === "string"
      ? parseInt(value)
      : value;

  // Update in the editable state hook
  handleInputChange(id, field, processedValue);
};
