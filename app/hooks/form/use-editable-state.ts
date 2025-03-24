import { useState } from "react";

export function useEditableState<T>(initialData: T | null) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editedData, setEditedData] = useState<T | null>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newItemData, setNewItemData] = useState<any>(null);
  const [newItemErrors, setNewItemErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const startEditing = () => {
    console.log("ln11: startEditing");
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
    setNewItemData(defaultNewItem);
  };

  const handleNewItemChange = (field: string, value: any) => {
    setNewItemData((prev: any) => ({ ...prev, [field]: value }));
  };

  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setNewItemData(null);
    setNewItemErrors({});
  };

  const validateNewItem = (requiredFields: string[]) => {
    const errors: { [key: string]: string } = {};

    if (newItemData) {
      for (const field of requiredFields) {
        if (!newItemData[field]) {
          errors[field] = `${field} is required.`;
        }
      }
    }

    setNewItemErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewItem = async ({
    event,
    requiredFields,
    formatData,
    endpoint,
    onSuccess,
    onError,
  }: {
    event: React.FormEvent;
    requiredFields: string[];
    formatData: (data: any) => any;
    endpoint: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    event.preventDefault();

    // Validate required fields
    if (!validateNewItem(requiredFields)) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Format the data using the provided formatting function
      const formattedData = formatData(newItemData);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add item: ${errorData.error || response.statusText}`
        );
      }

      cancelAddingNew();
      onSuccess?.(); // Call success callback if provided
    } catch (error) {
      console.error("Error adding item:", error);
      onError?.(error); // Call error callback if provided
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (id: string | null, field: string, value: any) => {
    setEditedData((prev) => {
      if (!prev) return prev;

      // If we're dealing with an array
      if (Array.isArray(prev)) {
        return prev.map((item: any) =>
          item.id === id ? { ...item, [field]: value } : item
        ) as unknown as T;
      }

      // If we're dealing with a single object with an id field
      if (
        typeof prev === "object" &&
        prev !== null &&
        "id" in prev &&
        id === (prev as any).id
      ) {
        return { ...prev, [field]: value } as T;
      }

      // Otherwise, just update the field directly on the object
      return { ...prev, [field]: value } as T;
    });
  };

  const handleDeleteItem = async ({
    id,
    confirmMessage = "Are you sure you want to delete this item?",
    endpoint,
    filterFn,
    onSuccess,
    onError,
  }: {
    id: string;
    confirmMessage?: string;
    endpoint: string;
    filterFn?: (item: any) => boolean;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => {
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to delete item: ${errorData.error || response.statusText}`
        );
      }

      // Remove from local state
      if (Array.isArray(editedData) && filterFn) {
        setEditedData(editedData.filter(filterFn) as unknown as T);
      }

      onSuccess?.(); // Call success callback if provided
    } catch (error) {
      console.error("Error deleting item:", error);
      onError?.(error); // Call error callback if provided
    }
  };

  return {
    isEditing,
    isAddingNew,
    editedData,
    isSubmitting,
    saveSuccess,
    newItemData,
    newItemErrors,
    setIsEditing,
    setIsAddingNew,
    setEditedData,
    setIsSubmitting,
    setSaveSuccess,
    setNewItemData,
    setNewItemErrors,
    startEditing,
    cancelEditing,
    startAddingNew,
    cancelAddingNew,
    handleNewItemChange,
    validateNewItem,
    handleInputChange,
    handleSaveNewItem,
    handleDeleteItem,
  };
}
