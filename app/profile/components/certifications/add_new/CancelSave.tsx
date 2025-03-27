import { Button } from "@/components/ui/button";
import React, { JSX } from "react";
import { CancelBtn } from "./CancelBtn";
import { SaveBtn } from "./SaveBtn";

interface CancelSaveProps {
  cancelAddingNew: () => void;
  isSubmitting: boolean;
  onSave?: () => void;
}

export function CancelSave({
  cancelAddingNew,
  isSubmitting,
  onSave,
}: CancelSaveProps) {
  return (
    <div className="flex justify-end gap-2">
      <CancelBtn
        cancelAddingNew={cancelAddingNew}
        isSubmitting={isSubmitting}
      />
      <SaveBtn isSubmitting={isSubmitting} onSave={onSave} />
    </div>
  );
}
