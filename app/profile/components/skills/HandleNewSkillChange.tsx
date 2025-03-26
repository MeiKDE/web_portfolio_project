// export const handleNewSkillChange = <T extends string>(
//   field: T,
//   value: string | number,
//   handleNewItemChange: (field: string, value: any) => void,
//   handleChange: (field: T, value: any) => void,
//   values: Record<string, any>
// ) => {
//   // Update in the editable state hook
//   handleNewItemChange(field, value);

//   // Also update in form validation if the field exists in values
//   if (field in values) {
//     handleChange(field, value);
//   }
// };

export const handleNewSkillChange = (
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
