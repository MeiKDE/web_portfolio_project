import { Lightbulb } from "lucide-react";
import React, { JSX } from "react";

interface Skill {
  name: string;
  category: string;
  proficiencyLevel: number;
}

export const SkillItem = ({ skill }: { skill: Skill }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{skill.name}</h4>
        <p className="text-sm text-muted-foreground">{skill.category}</p>
        <div className="flex mt-1">
          {/* Display the proficiency level of the skill between 1 and 5 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <Lightbulb
              key={i}
              className={`h-4 w-4 mr-1 ${
                i < skill.proficiencyLevel
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
