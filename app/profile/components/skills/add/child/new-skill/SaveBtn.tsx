import { Button } from "@/components/ui/button";

interface SaveBtnProps {
  isSubmitting: boolean;
}

export function SaveBtn({ isSubmitting }: SaveBtnProps) {
  return (
    <Button size="sm" type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Saving..." : "Save Skill"}
    </Button>
  );
}
