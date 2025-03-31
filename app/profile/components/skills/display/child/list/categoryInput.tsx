import { Input } from "@/components/ui/input";
import { Skill } from "../../../Interface";

interface CategoryInputProps {
  skill: Skill;
  skillInputChange: (id: string, field: string, value: string) => void;
}

export const CategoryInput = ({
  skill,
  skillInputChange,
}: CategoryInputProps) => {
  return (
    <Input
      type="text"
      value={skill.category}
      onChange={(e) => skillInputChange(skill.id, "category", e.target.value)}
      className={`text-sm mb-2 ${!skill.category ? "border-red-500" : ""}`}
      placeholder="Category *"
      required
    />
  );
};
