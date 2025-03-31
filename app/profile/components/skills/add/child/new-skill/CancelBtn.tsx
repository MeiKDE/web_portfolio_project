import { Button } from "@/components/ui/button";

interface CancelBtnProps {
  resetForm: () => void;
}

export function CancelBtn({ resetForm }: CancelBtnProps) {
  return (
    <Button variant="outline" size="sm" onClick={resetForm} type="button">
      Cancel
    </Button>
  );
}
