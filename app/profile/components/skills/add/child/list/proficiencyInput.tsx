import { Input } from "@/components/ui/input";
import { Skill } from "../../../Interface";

interface ProficiencyInputProps {
  skill: Skill;
  skillInputChange: (id: string, field: string, value: number) => void;
}

export const ProficiencyInput = ({
  skill,
  skillInputChange,
}: ProficiencyInputProps) => {
  const proficiencyLevel = skill.proficiencyLevel || 1;

  return (
    <Input
      type="number"
      min="1"
      max="10"
      value={proficiencyLevel}
      onChange={(e) =>
        skillInputChange(
          skill.id,
          "proficiencyLevel",
          parseInt(e.target.value) || 1
        )
      }
      className={`text-sm ${
        !proficiencyLevel || proficiencyLevel < 1 || proficiencyLevel > 5
          ? "border-red-500"
          : ""
      }`}
      placeholder="Proficiency Level (1-5) *"
      required
    />
  );
};
