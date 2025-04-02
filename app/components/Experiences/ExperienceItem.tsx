"use client";
import React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Briefcase } from "lucide-react";
import {
  formatDateForDisplay,
  formatDateForInput,
  calculateDuration,
  getCurrentDate,
} from "@/app/lib/utils/date-utils";

interface Experience {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  isCurrentPosition?: boolean;
  description?: string;
}

interface ExperienceItemProps {
  experience: Experience;
  isEditing: boolean;
  onInputChange: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
  getInputClassName: (
    id: string,
    field: string,
    defaultClass?: string
  ) => string;
  getFieldError: (id: string, field: string) => string | undefined;
  hasErrorType: (id: string, fields: string[]) => boolean;
  getErrorTypeMessage: (id: string, fields: string[]) => string;
}

// this function is used to display the experience item in the experience section
export default function ExperienceItem({
  experience,
  isEditing,
  onInputChange,
  onDelete,
  getInputClassName,
  getFieldError,
  hasErrorType,
  getErrorTypeMessage,
}: ExperienceItemProps) {
  return (
    <div className="flex gap-4 relative">
      <div className="flex-shrink-0 mt-1">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="flex-grow">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Position <span className="text-red-500">*</span>
                </label>
                <Input
                  value={experience.position}
                  onChange={(e) =>
                    onInputChange(experience.id, "position", e.target.value)
                  }
                  className={getInputClassName(
                    experience.id,
                    "position",
                    "w-full p-1 border rounded"
                  )}
                  placeholder="Position"
                />
                {getFieldError(experience.id, "position") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getFieldError(experience.id, "position")}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Company <span className="text-red-500">*</span>
                </label>
                <Input
                  value={experience.company}
                  onChange={(e) =>
                    onInputChange(experience.id, "company", e.target.value)
                  }
                  className={getInputClassName(
                    experience.id,
                    "company",
                    "w-full p-1 border rounded"
                  )}
                  placeholder="Company"
                />
                {getFieldError(experience.id, "company") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getFieldError(experience.id, "company")}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-1 block">
                Location
              </label>
              <Input
                value={experience.location}
                onChange={(e) =>
                  onInputChange(experience.id, "location", e.target.value)
                }
                className="w-full p-1 border rounded"
                placeholder="Location (City, Country)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formatDateForInput(experience.startDate)}
                  onChange={(e) =>
                    onInputChange(experience.id, "startDate", e.target.value)
                  }
                  className={getInputClassName(
                    experience.id,
                    "startDate",
                    "w-full p-1 border rounded"
                  )}
                  max={getCurrentDate()}
                />
                {getFieldError(experience.id, "startDate") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getFieldError(experience.id, "startDate")}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  End Date
                </label>
                <Input
                  type="date"
                  value={
                    experience.endDate
                      ? formatDateForInput(experience.endDate)
                      : ""
                  }
                  onChange={(e) =>
                    onInputChange(
                      experience.id,
                      "endDate",
                      e.target.value || null
                    )
                  }
                  className={getInputClassName(
                    experience.id,
                    "endDate",
                    "w-full p-1 border rounded"
                  )}
                  max={getCurrentDate()}
                  disabled={experience.isCurrentPosition}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={experience.isCurrentPosition}
                  onChange={(e) =>
                    onInputChange(
                      experience.id,
                      "isCurrentPosition",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                Current Position
              </label>
            </div>

            {hasErrorType(experience.id, ["startDate", "endDate"]) && (
              <p className="text-red-500 text-xs mt-1 mb-2">
                {getErrorTypeMessage(experience.id, ["startDate", "endDate"])}
              </p>
            )}

            <Textarea
              value={experience.description}
              onChange={(e) =>
                onInputChange(experience.id, "description", e.target.value)
              }
              className="mt-2 w-full p-1 border rounded"
              rows={4}
              placeholder="Description (optional)"
            />
          </>
        ) : (
          <>
            <p className="font-medium">{experience.position}</p>
            <p className="text-muted-foreground">{experience.company}</p>
            <p className="text-sm text-muted-foreground">
              {formatDateForDisplay(experience.startDate)} -{" "}
              {experience.endDate
                ? formatDateForDisplay(experience.endDate)
                : "Present"}
              {experience.startDate &&
                (experience.endDate || experience.isCurrentPosition) && (
                  <>
                    {" "}
                    ·{" "}
                    {calculateDuration(
                      experience.startDate,
                      experience.endDate || new Date().toISOString()
                    )}
                  </>
                )}
            </p>
            <p className="mt-2">{experience.description}</p>
          </>
        )}

        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 text-red-500"
            onClick={() => onDelete(experience.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
