import { Button } from "@/components/ui/button";

interface CancelSaveButtonsProps {
  cancelAddingNew: () => void;
  isSubmitting: boolean;
  CancelAdd: (cancelAddingNew: () => void, resetForm: () => void) => void;
  resetForm: () => void;
}

export function CancelSaveButtons({
  cancelAddingNew,
  isSubmitting,
  CancelAdd,
  resetForm,
}: CancelSaveButtonsProps) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => CancelAdd(cancelAddingNew, resetForm)}
        type="button"
      >
        Cancel
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Skill"}
      </Button>
    </div>
  );
}
