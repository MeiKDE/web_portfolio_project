"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewEducation } from "@/app/components/Educations/NewEducation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { EducationForm } from "./Educations/List/EducationForm";
import { EducationItem } from "./Educations/List/EducationItem";
import { useEducationsContext } from "@/context/EducationsContext";
import { useState } from "react";

interface EducationsProps {
  userId: string;
}

export default function Educations({ userId }: EducationsProps) {
  const {
    formData,
    isValidMap,
    isProcessing,
    formError,
    batchUpdate,
    createNewEducation,
    onChangeFormData,
    deleteByIdHandler,
  } = useEducationsContext();

  const [itemsToDelete, setItemsToDelete] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"view" | "add" | "edit">("view");

  if (isProcessing) return <LoadingSpinner />;
  if (formError) return <div>Error loading education information</div>;

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
      for (const id of itemsToDelete) {
        const edu = formData.find((e) => e.id === id);
        if (edu) {
          await deleteByIdHandler(edu);
        }
      }
      setItemsToDelete(new Set());
    }
    await batchUpdate();
    setMode("view");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Education</h3>
          <div className="flex gap-2">
            {mode === "view" && (
              <>
                <AddButton onClick={() => setMode("add")} />
                <EditButton onClick={() => setMode("edit")} />
              </>
            )}
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

        {mode === "add" && (
          <NewEducation
            createNew={async (...args) => {
              await createNewEducation(...args);
              setMode("view");
            }}
            userId={userId}
            onCancel={() => setMode("view")}
          />
        )}

        {mode === "view" ? (
          <>
            {formData.length > 0 &&
              formData.map((edu) => (
                <div
                  key={edu.id}
                  className="relative border-b pb-4 last:border-0"
                >
                  <EducationItem education={edu} />
                </div>
              ))}
          </>
        ) : mode === "edit" ? (
          <>
            {formData.map((edu) => (
              <div key={edu.id}>
                <EducationForm
                  onChangeFormData={onChangeFormData}
                  education={edu}
                  onDelete={() => toggleDeleteItem(edu.id)}
                  isMarkedForDeletion={itemsToDelete.has(edu.id)}
                  onDone={() => setMode("view")}
                />
              </div>
            ))}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
