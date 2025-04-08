import { Button } from "@/components/ui/button";

interface DoneButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export function DoneButton({
  children = "Done",
  onClick,
  isSubmitting = false,
  disabled = false,
}: DoneButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {children}
    </Button>
  );
}
