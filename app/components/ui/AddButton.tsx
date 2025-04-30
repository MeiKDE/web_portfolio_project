import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddButtonProps {
  onClick: () => void;
}

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <>
        <Plus className="h-4 w-4 mr-2" />
        Add
      </>
    </Button>
  );
}
