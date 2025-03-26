import { Button } from "@/components/ui/button";

interface CancelSaveButtonsProps {
  cancelAddingNew: () => void;
  isSubmitting: boolean;
  handleCancelAdd: (cancelAddingNew: () => void, resetForm: () => void) => void;
  handleSaveNewSkill: (
    e: React.FormEvent,
    validateForm: () => boolean,
    values: any,
    touchField: (field: string) => void,
    setNewItemData: (data: any) => void,
    userId: string,
    mutate: () => any,
    resetForm: () => void,
    cancelAddingNew: () => void
  ) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  values: any;
  touchField: (field: string) => void;
  setNewItemData: (data: any) => void;
  userId: string;
  mutate: () => any;
}

export function CancelSaveButtons({
  cancelAddingNew,
  isSubmitting,
  handleCancelAdd,
  handleSaveNewSkill,
  resetForm,
  validateForm,
  values,
  touchField,
  setNewItemData,
  userId,
  mutate,
}: CancelSaveButtonsProps) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleCancelAdd(cancelAddingNew, resetForm)}
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
