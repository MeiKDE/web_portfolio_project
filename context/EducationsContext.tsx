"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Education } from "@/app/components/Educations/educations.types";
import { toast } from "sonner";

interface EducationsContextType {
  isAdding: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  formData: Education[];
  isValidMap: Map<string, boolean>;
  setIsAdding: (value: boolean) => void;
  setIsEditing: (value: boolean) => void;
  onUpdateBatch: () => Promise<void>;
  onSaveNew: (education: Education) => Promise<void>;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  onDelete: (id: string) => Promise<void>;
}

const EducationsContext = createContext<EducationsContextType | undefined>(
  undefined
);

export function EducationsProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Education[]>([]);
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map());

  // Define fetchEducations function to be reusable
  const fetchEducations = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/educations`);
      if (!response.ok) throw new Error("Failed to fetch educations");
      const result = await response.json();
      if (result.success && result.data) {
        setFormData(result.data);
        // Initialize validation map
        const validMap = new Map();
        result.data.forEach((edu: Education) => validMap.set(edu.id, true));
        setIsValidMap(validMap);
      }
    } catch (error) {
      console.error("Error fetching educations:", error);
      toast.error("Error loading educations");
    }
  };

  // Add this useEffect to fetch initial data
  useEffect(() => {
    if (userId) {
      fetchEducations();
    }
  }, [userId]);

  const onUpdateBatch = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all(
        Array.from(changedIds).map(async (id) => {
          const education = formData.find((edu) => edu.id === id);
          if (education) {
            const response = await fetch(`/api/educations/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(education),
            });
            if (!response.ok) throw new Error("Failed to update education");
          }
        })
      );
      toast.success("Education updated successfully");
      setIsEditing(false);

      // Clear the changed IDs set
      setChangedIds(new Set());

      // Refresh data from server
      fetchEducations();
    } catch (error) {
      console.error("Error updating educations:", error);
      toast.error("Error updating educations");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSaveNew = async (education: Education) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/educations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(education),
      });
      if (!response.ok) throw new Error("Failed to add education");

      // Extract data from the API response
      const result = await response.json();

      if (result.success && result.data) {
        // Update the form data with the new education
        setFormData((prevData) => [...prevData, result.data]);

        // Set validation for the new item
        setIsValidMap((prev) => new Map(prev).set(result.data.id, true));

        toast.success("Education added successfully");
      } else {
        throw new Error(result.message || "Unknown error occurred");
      }

      setIsAdding(false);

      // Refresh the education data from the server
      fetchEducations();
    } catch (error) {
      console.error("Error adding education:", error);
      toast.error("Error adding education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeFormData = useCallback(
    (id: string, field: string, value: string, isFormValid: boolean) => {
      setFormData((prev) =>
        prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
      );
      setChangedIds((prev) => new Set(prev).add(id));
      setIsValidMap((prev) => new Map(prev).set(id, isFormValid));
    },
    []
  );

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/educations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete education");

      // Remove the item from formData
      setFormData((prev) => prev.filter((edu) => edu.id !== id));

      // Remove the item from isValidMap
      const newValidMap = new Map(isValidMap);
      newValidMap.delete(id);
      setIsValidMap(newValidMap);

      toast.success("Education deleted successfully");

      // Refresh data from server
      fetchEducations();
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Error deleting education");
    }
  };

  const value = {
    isAdding,
    isEditing,
    isSubmitting,
    formData,
    isValidMap,
    setIsAdding,
    setIsEditing,
    onUpdateBatch,
    onSaveNew,
    onChangeFormData,
    onDelete,
  };

  return (
    <EducationsContext.Provider value={value}>
      {children}
    </EducationsContext.Provider>
  );
}

export const useEducationsContext = () => {
  const context = useContext(EducationsContext);
  if (context === undefined) {
    throw new Error(
      "useEducationsContext must be used within an EducationsProvider"
    );
  }
  return context;
};
