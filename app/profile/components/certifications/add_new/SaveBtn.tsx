import { Button } from "@/components/ui/button";

interface SaveBtnProps {
  isSubmitting: boolean;
  onSave?: () => void;
}

export function SaveBtn({ isSubmitting }: SaveBtnProps) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Adding..." : "Save Certification"}
    </Button>
  );
}
