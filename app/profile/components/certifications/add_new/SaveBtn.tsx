import { Button } from "@/components/ui/button";

interface SaveBtnProps {
  isSubmitting: boolean;
  onSave?: () => void;
}

export function SaveBtn({ isSubmitting, onSave }: SaveBtnProps) {
  return (
    <Button type="submit" disabled={isSubmitting} onClick={onSave}>
      {isSubmitting ? "Adding..." : "Save Certification"}
    </Button>
  );
}
