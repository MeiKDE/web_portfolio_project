import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function DoneButton({
  onClick,
  isSubmitting,
  disabled,
}: {
  onClick: () => void;
  isSubmitting: boolean;
  disabled: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isSubmitting || disabled}
    >
      <>
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? "Saving..." : "Done"}
      </>
    </Button>
  );
}
