//this function is used to handle CHANGES to the new skill item
export const NewSkillChange = (
  field: string,
  value: any,
  setNewItemData: (data: any) => void,
  handleChange: (field: string, value: any) => void,
  values: any
) => {
  setNewItemData((prev: any) => ({
    ...prev,
    [field]: value,
  }));
  handleChange(field, value);
};
