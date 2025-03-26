import { Button } from "@/components/ui/button";
import React from "react";

interface CancelSaveButtonsProps {
  cancelAddingNew: () => void;
  isSubmitting: boolean;
}

export function CancelSaveButtons({
  cancelAddingNew,
  isSubmitting,
}: CancelSaveButtonsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={cancelAddingNew}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Save Certification"}
      </Button>
    </div>
  );
}
