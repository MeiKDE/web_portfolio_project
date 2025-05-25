"use client";
import { Card, CardContent } from "@/components/ui/card";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ProfileForm } from "./Profile/List/ProfileForm";
import { ProfileItem } from "./Profile/List/ProfileItem";
import { useProfileContext } from "@/context/ProfileContext";
import { useState } from "react";

interface ProfileProps {
  userId: string;
}

export default function Profile({ userId }: ProfileProps) {
  const {
    formData,
    isValidMap,
    isProcessing,
    formError,
    batchUpdate,
    onChangeFormData,
  } = useProfileContext();

  const [mode, setMode] = useState<"view" | "edit">("view");

  if (isProcessing) return <LoadingSpinner />;
  if (formError) return <div>Error loading profile information</div>;

  const handleDone = async () => {
    await batchUpdate();
    setMode("view");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Profile</h3>
          <div className="flex gap-2">
            {mode === "view" && <EditButton onClick={() => setMode("edit")} />}
            {mode === "edit" && (
              <DoneButton
                onClick={handleDone}
                disabled={
                  !Array.from(isValidMap.values()).every((isValid) => isValid)
                }
              />
            )}
          </div>
        </div>

        {mode === "view" ? (
          <div className="relative border-b pb-4 last:border-0">
            <ProfileItem profile={formData} />
          </div>
        ) : (
          <ProfileForm profile={formData} onFormChange={onChangeFormData} />
        )}
      </CardContent>
    </Card>
  );
}
