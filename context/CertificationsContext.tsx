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
  createNewCertification: (cert: Certification) => Promise<void>;
  deleteByIdHandler: (certification: Certification) => Promise<void>;
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

interface CertificationsProviderProps {
  userId: string;
  children: ReactNode;
}

export function CertificationsProvider({
  userId,
  children,
}: CertificationsProviderProps) {
  const [formData, setFormData] = useState<Certification[]>([]);
  const [changedId, setChangedId] = useState<Set<string>>(new Set());
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map());

  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  // When use mutate function, it'll re-render useFetchData
  // thus data, isLoading and error variables will be changed
  // then triggering useEffect
  const { data, isLoading, error, mutate } = useFetchData<Certification[]>(
    `/api/users/${userId}/certifications`
  );

  useEffect(() => {
    if (data) {
      setFormData(formatCertificationsForUI(data));
    }
  }, [data]);

  const formatCertificationForDatabase = (cert: Certification) => ({
    ...cert,
    issueDate: formatDateForDatabase(cert.issueDate),
    expirationDate: cert.expirationDate
      ? formatDateForDatabase(cert.expirationDate)
      : null,
  });

  // deleteHandler
  const deleteByIdHandler = async (certification: Certification) => {
    setIsProcessing(true);
    if (!certification.id) return;
    try {
      const response = await fetch(`/api/certifications/${certification.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Http error in deleting certification.");
        return;
      }
      //Otherwise
      toast.success("The certification is deleted successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error(
        "Unexpected error occurred from deleting certification",
        err
      );
      toast.error("Unexpected error occurred from deleting certification");
      setFormError("Unexpected error occurred from deleting certification");
    }
  };

  const updateByIdHandler = async (certification: Certification) => {
    setIsProcessing(true);
    if (!certification.id) return;
    try {
      const response = await fetch(`/api/certifications/${certification.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatCertificationForDatabase(certification)),
      });

      if (!response.ok) {
        toast.error("Http error in updating certification.");
        return;
      }
      //Otherwise
      toast.success("The certification is updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error(
        "Unexpected error occurred from updating certification",
        err
      );
      toast.error("Unexpected error occurred from updating certification");
      setFormError("Unexpected error occurred from updating certification");
    }
  };

  const batchUpdate = async () => {
    setIsProcessing(true);
    try {
      for (const cert of formData) {
        if (changedId.has(cert.id)) {
          await updateByIdHandler(cert);
        }
      }
      toast.success("List of certifications has been updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error(
        "Unexpected error occurred batch update certifications",
        err
      );
      toast.error("Unexpected error occurred fom batch update certifications");
      setFormError("Unexpected error occurred from batch update certification");
    }
  };

  const createNewCertification = async (newCert: Certification) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`/api/certifications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatCertificationForDatabase(newCert)),
      });

      if (!response.ok) {
        toast.error("Http error in adding certification.");
        return;
      }

      toast.success("Certification added successfully");
      setIsProcessing(false);
      mutate();
    } catch (error) {
      console.error(
        "Unexpected error occurred while adding new certification:",
        error
      );
      toast.error("Unexpected error occurred while adding new certification:");
      setFormError("Unexpected error occurred from adding a new certification");
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
        isValidMap,
        isProcessing,
        formError,
        onChangeFormData,
        batchUpdate,
        createNewCertification,
        deleteByIdHandler,
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : formError ? (
        <div>Error loading certifications</div>
      ) : (
        children
      )}
    </CertificationsContext.Provider>
  );
}
