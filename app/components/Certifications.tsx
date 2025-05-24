"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewCertification } from "@/app/components/Certifications/NewCertification";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { CertificationForm } from "./Certifications/List/CertificationForm";
import { CertificationItem } from "./Certifications/List/CertificationItem";
import { useCertificationsContext } from "@/context/CertificationsContext";
import { useState } from "react";

interface CertificationsProps {
  userId: string;
}

export default function Certifications({ userId }: CertificationsProps) {
  const {
    formData,
    isValidMap,
    isProcessing,
    formError,
    batchUpdate,
    createNewCertification,
    onChangeFormData,
    deleteByIdHandler,
  } = useCertificationsContext();

  if (isProcessing) return <LoadingSpinner />;
  if (formError) return <div>Error loading certifications information</div>;

  type Mode = "view" | "add" | "edit";
  const [mode, setMode] = useState<Mode>("view");

  /*
The component uses a single state called mode to switch between three views:
view – Show the list of certifications and "Add" + "Edit" buttons.
add – Show a form to add a new certification and a "Done" button.
edit – Show editable forms for existing certifications and a "Done" button.
The Done button is disabled if any form input is invalid.
*/

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>
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
          <NewCertification
            createNew={createNewCertification}
            userId={userId}
            onCancel={() => setMode("view")}
          />
        )}

        {mode === "view" ? (
          <>
            {formData.length > 0 &&
              formData.map((cert) => (
                <div
                  key={cert.id}
                  className="relative border-b pb-4 last:border-0"
                >
                  <CertificationItem certification={cert} />
                </div>
              ))}
          </>
        ) : mode === "edit" ? (
          <>
            {formData.map((cert) => (
              <div key={cert.id}>
                <CertificationForm
                  onChangeFormData={onChangeFormData}
                  certification={cert}
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
