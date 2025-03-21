import { useState } from "react";

export function useEditableState<T>(initialData: T | null) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editedData, setEditedData] = useState<T | null>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
    setEditedData(initialData);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setIsAddingNew(false);
    setEditedData(initialData);
  };

  const startAddingNew = (defaultNewItem: T) => {
    setIsAddingNew(true);
    setEditedData(defaultNewItem);
  };

  const handleInputChange = <K extends keyof T>(
    id: string | null,
    field: K,
    value: T[K]
  ) => {
    setEditedData((prev) => {
      if (!prev) return prev;

      // If we're dealing with an array of items with IDs
      if (id && Array.isArray(prev)) {
        return prev.map((item: any) =>
          item.id === id ? { ...item, [field]: value } : item
        ) as unknown as T;
      }

      // Otherwise, just update the field directly
      return { ...prev, [field]: value };
    });
  };

  return {
    isEditing,
    isAddingNew,
    editedData,
    isSubmitting,
    saveSuccess,
    setIsEditing,
    setIsAddingNew,
    setEditedData,
    setIsSubmitting,
    setSaveSuccess,
    startEditing,
    cancelEditing,
    startAddingNew,
    handleInputChange,
  };
}
