import React from "react";
import { CancelBtn } from "./CancelBtn";
import { SaveBtn } from "@/app/profile/components/ui/SaveBtn";

interface CancelSaveProps {
  isSubmitting: boolean;
  resetForm: () => void;
}

export function CancelSave({ isSubmitting, resetForm }: CancelSaveProps) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <CancelBtn resetForm={resetForm} />
      <SaveBtn isSubmitting={isSubmitting} component="" />
    </div>
  );
}
