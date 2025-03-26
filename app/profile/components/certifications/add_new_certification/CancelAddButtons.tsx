import { Button } from "@/components/ui/button";
import React from "react";

interface CancelAddButtonsProps {
  cancelAddingNew: () => void;
  isSubmitting: boolean;
}

export function CancelAddButtons({
  cancelAddingNew,
  isSubmitting,
}: CancelAddButtonsProps) {
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
        {isSubmitting ? "Adding..." : "Add Certification"}
      </Button>
    </div>
  );
}
