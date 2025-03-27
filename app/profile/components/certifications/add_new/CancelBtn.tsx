import { Button } from "@/components/ui/button";

interface CancelBtnProps {
  cancelAddingNew: () => void;
  isSubmitting: boolean;
}

export function CancelBtn({ cancelAddingNew, isSubmitting }: CancelBtnProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={cancelAddingNew}
      disabled={isSubmitting}
    >
      Cancel
    </Button>
  );
}
