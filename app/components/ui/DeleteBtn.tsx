import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
interface DeleteButtonProps {
  onDeleteClick: () => void;
}

export function DeleteButton({ onDeleteClick }: DeleteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onDeleteClick}
      className="h-8 w-8 text-red-500"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
