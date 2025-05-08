import { Button } from "@/components/ui/button";

interface CancelBtnProps {
  resetForm: () => void;
  onClick?: () => void;
}

export function CancelBtn({ resetForm, onClick }: CancelBtnProps) {
  const handleClick = () => {
    resetForm();
    if (onClick) onClick();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} type="button">
      Cancel
    </Button>
  );
}
