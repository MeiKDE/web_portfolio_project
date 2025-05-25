"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewSkill } from "@/app/components/Skills/NewSkill";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SkillForm } from "./Skills/List/SkillForm";
import { SkillItem } from "./Skills/List/SkillItem";
import { useSkillsContext } from "@/context/SkillsContext";
import { useState } from "react";

interface SkillsProps {
  userId: string;
}

export default function Skills({ userId }: SkillsProps) {
  const {
    formData,
    isValidMap,
    isProcessing,
    formError,
    batchUpdate,
    createNewSkill,
    onChangeFormData,
  } = useSkillsContext();

  const [itemsToDelete, setItemsToDelete] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"view" | "add" | "edit">("view");

  if (isProcessing) return <LoadingSpinner />;
  if (formError) return <div>Error loading skills information</div>;

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
    await batchUpdate(Array.from(itemsToDelete));
    setItemsToDelete(new Set());
    setMode("view");
  };

  const handleCreateNewSkill = async (
    ...args: Parameters<typeof createNewSkill>
  ) => {
    await createNewSkill(...args);
    setMode("view");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
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
          <NewSkill
            createNew={handleCreateNewSkill}
            userId={userId}
            onCancel={() => setMode("view")}
          />
        )}

        {mode === "view" ? (
          <>
            {formData.length > 0 &&
              formData.map((skill) => (
                <div
                  key={skill.id}
                  className="relative border-b pb-4 last:border-0"
                >
                  <SkillItem skill={skill} />
                </div>
              ))}
          </>
        ) : mode === "edit" ? (
          <>
            {formData.map((skill) => (
              <div key={skill.id}>
                <SkillForm
                  onChangeFormData={onChangeFormData}
                  skill={skill}
                  onDelete={() => toggleDeleteItem(skill.id)}
                  isMarkedForDeletion={itemsToDelete.has(skill.id)}
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
