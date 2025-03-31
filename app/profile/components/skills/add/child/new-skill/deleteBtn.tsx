import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DeleteButtonProps {
  onDeleteClick: (id: string) => void;
  isDeleting: string | null;
  skillId: string;
}

export const DeleteButton = ({
  onDeleteClick,
  isDeleting,
  skillId,
}: DeleteButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onDeleteClick(skillId)}
      className="h-8 w-8 text-red-500"
      disabled={isDeleting === skillId}
    >
      {isDeleting === skillId ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </Button>
  );
};
