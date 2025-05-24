import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  onClick: () => void;
  isMarkedForDeletion: boolean;
}

export function DeleteButton({
  onClick,
  isMarkedForDeletion,
}: DeleteButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={isMarkedForDeletion ? "text-green-500" : "text-red-500"}
    >
      {isMarkedForDeletion ? (
        <Check className="h-4 w-4" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </Button>
  );
}
