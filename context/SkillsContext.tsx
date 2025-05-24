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
  isValidMap: Map<string, boolean>;
  isProcessing: boolean;
  formError: string;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  batchUpdate: () => Promise<void>;
  createNewSkill: (skill: Skill) => Promise<void>;
  deleteByIdHandler: (skill: Skill) => Promise<void>;
}

const SkillsContext = createContext<SkillsContextProps | undefined>(undefined);

export const useSkillsContext = () => {
  const context = useContext(SkillsContext);
  if (!context)
    throw new Error("useSkillsContext must be used within a Provider");
  return context;
};

interface SkillsProviderProps {
  userId: string;
  children: ReactNode;
}

export function SkillsProvider({ userId, children }: SkillsProviderProps) {
  const [formData, setFormData] = useState<Skill[]>([]);
  const [changedId, setChangedId] = useState<Set<string>>(new Set());
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/users/${userId}/skills`
  );

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const deleteByIdHandler = async (skill: Skill) => {
    setIsProcessing(true);
    if (!skill.id) return;
    try {
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Http error in deleting skill.");
        return;
      }
      toast.success("The skill is deleted successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred from deleting skill", err);
      toast.error("Unexpected error occurred from deleting skill");
      setFormError("Unexpected error occurred from deleting skill");
    }
  };

  const updateByIdHandler = async (skill: Skill) => {
    setIsProcessing(true);
    if (!skill.id) return;
    try {
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skill),
      });

      if (!response.ok) {
        toast.error("Http error in updating skill.");
        return;
      }
      toast.success("The skill is updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred from updating skill", err);
      toast.error("Unexpected error occurred from updating skill");
      setFormError("Unexpected error occurred from updating skill");
    }
  };

  const batchUpdate = async () => {
    setIsProcessing(true);
    try {
      for (const skill of formData) {
        if (changedId.has(skill.id)) {
          await updateByIdHandler(skill);
        }
      }
      toast.success("List of skills has been updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred batch update skills", err);
      toast.error("Unexpected error occurred from batch update skills");
      setFormError("Unexpected error occurred from batch update skills");
    }
  };

  const createNewSkill = async (newSkill: Skill) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/skills/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });

      if (!response.ok) {
        toast.error("Http error in adding skill.");
        return;
      }

      toast.success("Skill added successfully");
      setIsProcessing(false);
      mutate();
    } catch (error) {
      console.error("Unexpected error occurred while adding new skill:", error);
      toast.error("Unexpected error occurred while adding new skill");
      setFormError("Unexpected error occurred from adding a new skill");
    }
  };

  const onChangeFormData = (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => {
    setIsValidMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, isFormValid);
      return newMap;
    });

    setChangedId((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });

    setFormData((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  return (
    <SkillsContext.Provider
      value={{
        formData,
        isValidMap,
        isProcessing,
        formError,
        onChangeFormData,
        batchUpdate,
        createNewSkill,
        deleteByIdHandler,
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : formError ? (
        <div>Error loading skills</div>
      ) : (
        children
      )}
    </SkillsContext.Provider>
  );
}
