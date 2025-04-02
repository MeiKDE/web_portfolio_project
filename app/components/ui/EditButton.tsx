import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <>
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </>
    </Button>
  );
}
