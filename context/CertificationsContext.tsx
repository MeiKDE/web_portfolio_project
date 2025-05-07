"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Certification } from "@/app/components/Certifications/certifications.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import {
  formatDateForDatabase,
  formatCertificationsForUI,
} from "@/app/lib/utils/date-utils";
import { toast } from "sonner";

interface CertificationsContextProps {
  formData: Certification[];
  isEditing: boolean;
  isAdding: boolean;
  isSubmitting: boolean;
  isValidMap: Map<string, boolean>;
  setIsEditing: (val: boolean) => void;
  setIsAdding: (val: boolean) => void;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  onUpdateBatch: () => Promise<void>;
  onSaveNew: (cert: Certification) => Promise<void>;
  onDelete: (id: string | null) => Promise<void>;
}

const CertificationsContext = createContext<
  CertificationsContextProps | undefined
>(undefined);

export const useCertificationsContext = () => {
  const context = useContext(CertificationsContext);
  if (!context)
    throw new Error("useCertificationsContext must be used within a Provider");
  return context;
};

export function CertificationsProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const [formData, setFormData] = useState<Certification[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changedId, setChangedId] = useState<Set<string>>(new Set());
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map());

  const { data, isLoading, error, mutate } = useFetchData<Certification[]>(
    `/api/users/${userId}/certifications`
  );

  useEffect(() => {
    if (data) {
      setFormData(formatCertificationsForUI(data));
    }
  }, [data]);

  const formatFormData = (cert: Certification) => ({
    ...cert,
    issueDate: formatDateForDatabase(cert.issueDate),
    expirationDate: cert.expirationDate
      ? formatDateForDatabase(cert.expirationDate)
      : null,
  });

  const onDelete = async (id: string | null) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("The certification is deleted successfully");
      mutate();
    } catch (err) {
      console.error("Error deleting certification:", err);
      toast.error("Error deleting certification");
    }
  };

  const onUpdate = async (certification: Certification) => {
    if (!certification.id) return;
    try {
      const res = await fetch(`/api/certifications/${certification.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatFormData(certification)),
      });
      if (!res.ok) throw new Error();
      toast.success("The certification has been updated");
    } catch (err) {
      console.error("Error updating certification:", err);
      toast.error("Failed to update certification");
    }
  };

  const onUpdateBatch = async () => {
    setIsSubmitting(true);
    try {
      for (const cert of formData) {
        if (changedId.has(cert.id)) {
          await onUpdate(cert);
        }
      }
      toast.success("List of certifications has been updated successfully");
      mutate();
    } catch (error) {
      console.error("Error updating certifications:", error);
      toast.error("Error updating certifications");
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const onSaveNew = async (newCert: Certification) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/certifications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatFormData(newCert)),
      });
      if (!response.ok) throw new Error("Failed to add certification");
      toast.success("Certification added successfully");
      mutate();
    } catch (error) {
      console.error("Error adding new certification:", error);
      toast.error("Error adding new certification");
    } finally {
      setIsSubmitting(false);
      setIsAdding(false);
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
      prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  return (
    <CertificationsContext.Provider
      value={{
        formData,
        isEditing,
        isAdding,
        isSubmitting,
        isValidMap,
        setIsEditing,
        setIsAdding,
        onChangeFormData,
        onUpdateBatch,
        onSaveNew,
        onDelete,
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading certifications</div>
      ) : (
        children
      )}
    </CertificationsContext.Provider>
  );
}
