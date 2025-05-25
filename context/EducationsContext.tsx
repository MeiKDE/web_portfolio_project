"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Education } from "@/app/components/Educations/educations.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { toast } from "sonner";

interface EducationsContextProps {
  formData: Education[];
  isValidMap: Map<string, boolean>;
  isProcessing: boolean;
  formError: string;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  batchUpdate: (itemsToDelete?: string[]) => Promise<void>;
  createNewEducation: (edu: Education) => Promise<void>;
}

const EducationsContext = createContext<EducationsContextProps | undefined>(
  undefined
);

export const useEducationsContext = () => {
  const context = useContext(EducationsContext);
  if (!context)
    throw new Error("useEducationsContext must be used within a Provider");
  return context;
};

interface EducationsProviderProps {
  userId: string;
  children: ReactNode;
}

export function EducationsProvider({
  userId,
  children,
}: EducationsProviderProps) {
  const [formData, setFormData] = useState<Education[]>([]);
  const [changedId, setChangedId] = useState<Set<string>>(new Set());
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  const { data, isLoading, error, mutate } = useFetchData<Education[]>(
    `/api/users/${userId}/educations`
  );

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const formatEducationForDatabase = (edu: Education) => ({
    ...edu,
    startYear: Number(edu.startYear),
    endYear: edu.endYear ? Number(edu.endYear) : null,
  });

  const deleteByIdHandler = async (education: Education) => {
    setIsProcessing(true);
    if (!education.id) return;
    try {
      const response = await fetch(`/api/educations/${education.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Http error in deleting education.");
        return;
      }
      toast.success("The education is deleted successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred from deleting education", err);
      toast.error("Unexpected error occurred from deleting education");
      setFormError("Unexpected error occurred from deleting education");
    }
  };

  const updateByIdHandler = async (education: Education) => {
    setIsProcessing(true);
    if (!education.id) return;
    try {
      const response = await fetch(`/api/educations/${education.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatEducationForDatabase(education)),
      });

      if (!response.ok) {
        toast.error("Http error in updating education.");
        return;
      }
      toast.success("The education is updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred from updating education", err);
      toast.error("Unexpected error occurred from updating education");
      setFormError("Unexpected error occurred from updating education");
    }
  };

  const batchUpdate = async (itemsToDelete: string[] = []) => {
    setIsProcessing(true);
    try {
      // Handle deletions first
      for (const id of itemsToDelete) {
        const edu = formData.find((e) => e.id === id);
        if (edu) {
          await deleteByIdHandler(edu);
        }
      }

      // Handle updates
      for (const edu of formData) {
        if (changedId.has(edu.id) && !itemsToDelete.includes(edu.id)) {
          await updateByIdHandler(edu);
        }
      }

      toast.success("Educations have been updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred batch update educations", err);
      toast.error("Unexpected error occurred from batch update educations");
      setFormError("Unexpected error occurred from batch update educations");
    }
  };

  const createNewEducation = async (newEdu: Education) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/educations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatEducationForDatabase(newEdu)),
      });

      if (!response.ok) {
        toast.error("Http error in adding education.");
        return;
      }

      toast.success("Education added successfully");
      setIsProcessing(false);
      mutate();
    } catch (error) {
      console.error(
        "Unexpected error occurred while adding new education:",
        error
      );
      toast.error("Unexpected error occurred while adding new education");
      setFormError("Unexpected error occurred from adding a new education");
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
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  return (
    <EducationsContext.Provider
      value={{
        formData,
        isValidMap,
        isProcessing,
        formError,
        onChangeFormData,
        batchUpdate,
        createNewEducation,
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : formError ? (
        <div>Error loading educations</div>
      ) : (
        children
      )}
    </EducationsContext.Provider>
  );
}
