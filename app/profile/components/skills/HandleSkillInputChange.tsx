// Handler for input changes in edit mode
export const handleSkillInputChange = <T extends string>(
  id: string,
  field: T,
  value: any,
  handleInputChange: (id: string, field: string, value: any) => void,
  touchField: (field: T) => void
) => {
  // Process number values
  const processedValue =
    field === "proficiencyLevel" && typeof value === "string"
      ? parseInt(value)
      : value;

  // Update in the editable state hook
  handleInputChange(id, field, processedValue);

  // Mark field as touched for validation
  touchField(field);
};
