// Don't try to use the hook here - this is not a React component
export const handleCancelAdd = (cancelAddingNew: () => void) => {
  cancelAddingNew();
};
