import { Button } from "@/components/ui/button";

// This component is used to save the multiple components
const component = (component: string) => {
  switch (component) {
    case "Skill":
      return "Save Skill";
    case "Certification":
      return "Save Certification";
    case "Experience":
      return "Save Experience";
    case "Education":
      return "Save Education";
    default:
      return "Unmatched component";
  }
};
interface SaveBtnProps {
  isSubmitting: boolean;
  component: string;
}

export function SaveBtn({ isSubmitting, component }: SaveBtnProps) {
  return (
    <Button size="sm" type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Saving..." : `${component}`}
    </Button>
  );
}
