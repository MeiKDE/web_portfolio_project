import { Certification } from "./Interface";

// This function is for real-time form input handling CHANGE
// Called: On every input change in the form fields
export const handleNewCertificationChange = (
  field: keyof Omit<Certification, "id">,
  value: string,
  handleNewItemChange: (field: string, value: any) => void
) => {
  handleNewItemChange(field, value);
};
