import React from "react";

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
        <h4 className="font-medium">{education.institution}</h4>
        <p className="text-sm text-muted-foreground">{education.degree}</p>
        <div className="flex mt-1 text-xs text-muted-foreground">
          <span>From: {education.startYear}</span>
          {education.endYear && (
            <>
              <span className="mx-2">•</span>
              <span>To: {education.endYear}</span>
            </>
          )}
          {education.degree && (
            <>
              <span className="mx-2">•</span>
              <span>Degree: {education.degree}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
