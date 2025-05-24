"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Profile } from "@/app/components/Profile/profile.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { toast } from "sonner";

interface ProfileContextProps {
  formData: Profile;
  isValidMap: Map<string, boolean>;
  isProcessing: boolean;
  formError: string;
  onChangeFormData: (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => void;
  updateProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined
);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfileContext must be used within a Provider");
  return context;
};

interface ProfileProviderProps {
  userId: string;
  children: ReactNode;
}

export function ProfileProvider({ userId, children }: ProfileProviderProps) {
  const [formData, setFormData] = useState<Profile | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isValidMap, setIsValidMap] = useState<Map<string, boolean>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  const { data, isLoading, error, mutate } = useFetchData<Profile>(
    `/api/users/${userId}/profile`
  );

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const updateProfile = async () => {
    if (!formData) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/profile/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast.error("Error updating profile");
        return;
      }

      toast.success("Profile updated successfully");
      setIsProcessing(false);
      mutate();
    } catch (err) {
      console.error("Unexpected error occurred updating profile", err);
      toast.error("Unexpected error occurred updating profile");
      setFormError("Unexpected error occurred updating profile");
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

    setIsChanged(true);
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <ProfileContext.Provider
      value={{
        formData: formData!,
        isValidMap,
        isProcessing,
        formError,
        onChangeFormData,
        updateProfile,
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : formError ? (
        <div>Error loading profile</div>
      ) : (
        children
      )}
    </ProfileContext.Provider>
  );
}
