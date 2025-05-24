"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Experience } from "@/app/components/Experiences/experiences.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import {
  formatDateForDatabase,
  formatExperiencesForUI,
} from "@/app/lib/utils/date-utils";
import { toast } from "sonner";

interface ExperiencesContextProps {
  formData: Experience[];
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
  createNewExperience: (exp: Experience) => Promise<void>;
  deleteByIdHandler: (experience: Experience) => Promise<void>;
}

const ExperiencesContext = createContext<ExperiencesContextProps | undefined>(
  undefined
);

export const useExperiencesContext = () => {
  const context = useContext(ExperiencesContext);
  if (!context)
    throw new Error("useExperiencesContext must be used within a Provider");
  return context;
};

interface ExperiencesProviderProps {
  userId: string;
  children: ReactNode;
}

export function ExperiencesProvider({
  userId,
  children,
}: ExperiencesProviderProps) {
  const [formData, setFormData] = useState<Experience[]>([]);
  const [changedId, setChangedId] = useState<Set<string>>(new Set());
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");
  const [itemsToDelete, setItemsToDelete] = useState<Set<string>>(new Set());

  const { data, isLoading, error, mutate } = useFetchData<Experience[]>(
    `/api/users/${userId}/experiences`
  );

  useEffect(() => {
    if (data) {
      setFormData(formatExperiencesForUI(data));
    }
  }, [data]);

  const formatExperienceForDatabase = (exp: Experience) => ({
    ...exp,
    startDate: formatDateForDatabase(exp.startDate),
    endDate: exp.endDate ? formatDateForDatabase(exp.endDate) : null,
  });

  const toggleDeleteItem = (id: string) => {
    setItemsToDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDone = async () => {
    if (itemsToDelete.size > 0) {
      // Delete items individually
      for (const id of itemsToDelete) {
        const exp = formData.find((e) => e.id === id);
        if (exp) {
          await deleteByIdHandler(exp);
        }
      }
      setItemsToDelete(new Set());
    }
    await batchUpdate();
  };

  const deleteByIdHandler = async (experience: Experience) => {
    setIsProcessing(true);
    if (!experience.id) return;
    try {
      const response = await fetch(`/api/experiences/${experience.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Http error in deleting experience.");
        return;
      }
      toast.success("The experience is deleted successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred from deleting experience", err);
      toast.error("Unexpected error occurred from deleting experience");
      setFormError("Unexpected error occurred from deleting experience");
    }
  };

  const updateByIdHandler = async (experience: Experience) => {
    setIsProcessing(true);
    if (!experience.id) return;
    try {
      const response = await fetch(`/api/experiences/${experience.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatExperienceForDatabase(experience)),
      });

      if (!response.ok) {
        toast.error("Http error in updating experience.");
        return;
      }
      toast.success("The experience is updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred from updating experience", err);
      toast.error("Unexpected error occurred from updating experience");
      setFormError("Unexpected error occurred from updating experience");
    }
  };

  const batchUpdate = async () => {
    setIsProcessing(true);
    try {
      for (const exp of formData) {
        if (changedId.has(exp.id)) {
          await updateByIdHandler(exp);
        }
      }
      toast.success("List of experiences has been updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred batch update experiences", err);
      toast.error("Unexpected error occurred from batch update experiences");
      setFormError("Unexpected error occurred from batch update experiences");
    }
  };

  const createNewExperience = async (newExp: Experience) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/experiences/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatExperienceForDatabase(newExp)),
      });

      if (!response.ok) {
        toast.error("Http error in adding experience.");
        return;
      }

      toast.success("Experience added successfully");
      setIsProcessing(false);
      mutate();
    } catch (error) {
      console.error(
        "Unexpected error occurred while adding new experience:",
        error
      );
      toast.error("Unexpected error occurred while adding new experience");
      setFormError("Unexpected error occurred from adding a new experience");
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
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  return (
    <ExperiencesContext.Provider
      value={{
        formData,
        isValidMap,
        isProcessing,
        formError,
        onChangeFormData,
        batchUpdate,
        createNewExperience,
        deleteByIdHandler,
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : formError ? (
        <div>Error loading experiences</div>
      ) : (
        children
      )}
    </ExperiencesContext.Provider>
  );
}
