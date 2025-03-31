import { Button } from "@/components/ui/button";

interface CancelBtnProps {
  resetForm: () => void;
}

export function CancelBtn({ resetForm }: CancelBtnProps) {
  return (
    <Button variant="ghost" onClick={resetForm}>
      Cancel
    </Button>
  );
}
