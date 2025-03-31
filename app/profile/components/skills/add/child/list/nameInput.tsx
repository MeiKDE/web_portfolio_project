import { Input } from "@/components/ui/input";
import { Skill } from "../../../Interface";

interface NameInputProps {
  skill: Skill;
  skillInputChange: (id: string, field: string, value: string) => void;
}

export const NameInput = ({ skill, skillInputChange }: NameInputProps) => {
  return (
    <Input
      type="text"
      value={skill.name}
      onChange={(e) => {
        skillInputChange(skill.id, "name", e.target.value);
      }}
      className={`font-medium mb-2 ${!skill.name ? "border-red-500" : ""}`}
      placeholder="Skill Name *"
      required
    />
  );
};
