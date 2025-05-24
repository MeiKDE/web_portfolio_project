"use client";
import React from "react";
import { Experience } from "@/app/components/Experiences/experiences.types";
import { Briefcase } from "lucide-react";
import { formatDateForDisplay } from "@/app/lib/utils/date-utils";

interface ExperienceItemProps {
  experience: Experience;
}

export const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex flex-col">
          <h4 className="font-medium">{experience.position}</h4>
          <p className="text-muted-foreground">{experience.companyName}</p>

          <div className="flex flex-col text-sm text-muted-foreground">
            {experience.location && <span>{experience.location}</span>}

            <span>
              {formatDateForDisplay(experience.startDate)} -{" "}
              {experience.isCurrentPosition
                ? "Present"
                : formatDateForDisplay(experience.endDate!)}
            </span>

            {experience.isCurrentPosition && (
              <span className="text-primary text-sm">Current Position</span>
            )}
          </div>

          {experience.description && (
            <p className="mt-2 text-sm whitespace-pre-wrap">
              {experience.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
