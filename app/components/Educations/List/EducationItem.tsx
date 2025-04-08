import React from "react";
import { GraduationCap } from "lucide-react";

interface Education {
  institution: string;
  institutionLogoUrl?: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  description?: string;
}

export const EducationItem = ({ education }: { education: Education }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h4 className="font-medium">{education.institution}</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          {education.fieldOfStudy}
        </p>
        <div className="flex mt-1 text-xs text-muted-foreground">
          <span>{education.startYear}</span>
          <span className="mx-2">-</span>
          <span>{education.endYear}</span>
          {education.degree && (
            <>
              <span className="mx-2">•</span>
              <span>{education.degree}</span>
            </>
          )}
        </div>
      </div>
      {education.institutionLogoUrl && (
        <img
          src={education.institutionLogoUrl}
          alt={`${education.institution} logo`}
          className="h-12 w-12 object-contain"
        />
      )}
    </div>
  );
};
