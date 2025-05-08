"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewEducation } from "@/app/components/Educations/NewEducation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { EducationForm } from "./Educations/List/EducationForm";
import { EducationItem } from "./Educations/List/EducationItem";
import { useEducationsContext } from "@/context/EducationsContext";
import { Education } from "@/app/components/Educations/educations.types";

interface EducationsProps {
  userId: string;
}

export default function Educations({ userId }: EducationsProps) {
  const {
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
  } = useEducationsContext();

  const { isLoading, error } = useFetchData(`/api/users/${userId}/educations`);

  const onAddNew = () => setIsAdding(true);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading education information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Education</h3>
          <div className="flex gap-2">
            {!isAdding && !isEditing && <AddButton onClick={onAddNew} />}
            {!isEditing && !isAdding && (
              <EditButton onClick={() => setIsEditing(true)} />
            )}
            {isEditing && (
              <DoneButton
                onClick={onUpdateBatch}
                isSubmitting={isSubmitting}
                disabled={
                  !Array.from(isValidMap.values()).every((isValid) => isValid)
                }
              />
            )}
          </div>
        </div>

        {isAdding && (
          <NewEducation
            onSaveNew={onSaveNew}
            userId={userId}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {!isEditing ? (
          <>
            {Array.isArray(formData) && formData.length > 0 ? (
              formData.map((edu: Education) => (
                <div
                  key={edu.id}
                  className="relative border-b pb-4 last:border-0"
                >
                  <EducationItem education={edu} />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education entries yet</p>
            )}
          </>
        ) : (
          <>
            {Array.isArray(formData) &&
              formData.map((edu: Education) => (
                <div key={edu.id}>
                  <EducationForm
                    onChangeFormData={onChangeFormData}
                    education={edu}
                    onDelete={onDelete}
                    isEditing={isEditing}
                  />
                </div>
              ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
