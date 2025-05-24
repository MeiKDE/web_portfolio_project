"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewExperience } from "@/app/components/Experiences/NewExperience";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ExperienceForm } from "./Experiences/List/ExperienceForm";
import { ExperienceItem } from "./Experiences/List/ExperienceItem";
import { useExperiencesContext } from "../../context/ExperiencesContext";
import { useState } from "react";

interface ExperiencesProps {
  userId: string;
}

export default function Experiences({ userId }: ExperiencesProps) {
  const {
    formData,
    isValidMap,
    isProcessing,
    formError,
    batchUpdate,
    createNewExperience,
    onChangeFormData,
    deleteByIdHandler,
  } = useExperiencesContext();

  if (isProcessing) return <LoadingSpinner />;
  if (formError) return <div>Error loading experiences information</div>;

  type Mode = "view" | "add" | "edit";
  const [mode, setMode] = useState<Mode>("view");

  /*
  The component uses a single state called mode to switch between three views:
  view – Show the list of experiences and "Add" + "Edit" buttons.
  add – Show a form to add a new experience and a "Done" button.
  edit – Show editable forms for existing experiences and a "Done" button.
  The Done button is disabled if any form input is invalid.
  */

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Experiences</h3>
          <div className="flex gap-2">
            {mode === "view" && (
              <>
                <AddButton
                  onClick={() => {
                    setMode("add");
                  }}
                />
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
          <NewExperience
            createNew={createNewExperience}
            userId={userId}
            onCancel={() => setMode("view")}
          />
        )}

        {mode === "view" ? (
          <>
            {formData.length > 0 &&
              formData.map((exp) => (
                <div
                  key={exp.id}
                  className="relative border-b pb-4 last:border-0"
                >
                  <ExperienceItem experience={exp} />
                </div>
              ))}
          </>
        ) : mode === "edit" ? (
          <>
            {formData.map((exp) => (
              <div key={exp.id}>
                <ExperienceForm
                  onChangeFormData={onChangeFormData}
                  experience={exp}
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
