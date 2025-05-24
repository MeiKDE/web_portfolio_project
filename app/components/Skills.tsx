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
    deleteByIdHandler,
  } = useSkillsContext();

  if (isProcessing) return <LoadingSpinner />;
  if (formError) return <div>Error loading skills information</div>;

  type Mode = "view" | "add" | "edit";
  const [mode, setMode] = useState<Mode>("view");

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
            {mode !== "view" && mode === "edit" && (
              <DoneButton
                onClick={() => {
                  batchUpdate();
                  setMode("view");
                }}
                disabled={
                  !Array.from(isValidMap.values()).every((isValid) => isValid)
                }
              />
            )}
          </div>
        </div>

        {mode === "add" && (
          <NewSkill
            createNew={createNewSkill}
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
                  onDelete={deleteByIdHandler}
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
