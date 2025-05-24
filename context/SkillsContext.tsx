"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Skill } from "@/app/components/Skills/skills.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { toast } from "sonner";

interface SkillsContextProps {
  formData: Skill[];
  isEditing: boolean;
  isAdding: boolean;
  isSubmitting: boolean;
  isValidMap: Map<string, boolean>;
  isLoading: boolean;
  error: Error | null;
  setIsEditing: (val: boolean) => void;
  setIsAdding: (val: boolean) => void;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  onUpdateBatch: () => Promise<void>;
  onSaveNew: (skill: Skill) => Promise<void>;
  onDelete: (id: string | null) => Promise<void>;
}

const SkillsContext = createContext<SkillsContextProps | undefined>(undefined);

export const useSkillsContext = () => {
  const context = useContext(SkillsContext);
  if (!context)
    throw new Error("useSkillsContext must be used within a Provider");
  return context;
};

export function SkillsProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const [formData, setFormData] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changedId, setChangedId] = useState<Set<string>>(new Set());
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map());

  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/users/${userId}/skills`
  );

  useEffect(() => {
    if (data) {
      setFormData(data);
      const validMap = new Map();
      data.forEach((skill) => validMap.set(skill.id, true));
      setIsValidMap(validMap);
    }
  }, [data]);

  const onChangeFormData = (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => {
    setFormData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    setIsValidMap((prev) => new Map(prev).set(id, isFormValid));
    setChangedId((prev) => new Set(prev).add(id));
  };

  const onUpdateBatch = async () => {
    try {
      setIsSubmitting(true);
      const updatedSkills = Array.from(changedId)
        .map((id) => formData.find((skill) => skill.id === id))
        .filter(Boolean) as Skill[];

      await fetch(`/api/users/${userId}/skills/batch`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSkills),
      });

      setChangedId(new Set());
      setIsEditing(false);
      mutate();
      toast.success("Skills updated successfully");
    } catch (error) {
      toast.error("Failed to update skills");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSaveNew = async (skill: Skill) => {
    try {
      setIsSubmitting(true);
      await fetch(`/api/users/${userId}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skill),
      });

      setIsAdding(false);
      mutate();
      toast.success("Skill added successfully");
    } catch (error) {
      toast.error("Failed to add skill");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id: string | null) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await fetch(`/api/users/${userId}/skills/${id}`, {
        method: "DELETE",
      });

      mutate();
      toast.success("Skill deleted successfully");
    } catch (error) {
      toast.error("Failed to delete skill");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SkillsContext.Provider
      value={{
        formData,
        isEditing,
        isAdding,
        isSubmitting,
        isValidMap,
        isLoading,
        error,
        setIsEditing,
        setIsAdding,
        onChangeFormData,
        onUpdateBatch,
        onSaveNew,
        onDelete,
      }}
    >
      {children}
    </SkillsContext.Provider>
  );
}
