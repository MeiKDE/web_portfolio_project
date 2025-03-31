import React from "react";
import { CancelBtn } from "./CancelBtn";
import { SaveBtn } from "./SaveBtn";

interface CancelSaveProps {
  isSubmitting: boolean;
  resetForm: () => void;
}

export function CancelSave({ isSubmitting, resetForm }: CancelSaveProps) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <CancelBtn resetForm={resetForm} />
      <SaveBtn isSubmitting={isSubmitting} />
    </div>
  );
}
