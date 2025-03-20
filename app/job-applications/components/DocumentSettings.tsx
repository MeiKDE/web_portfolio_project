"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface DocumentSettingsProps {
  settings: {
    tone: string;
    focusAreas: string[];
    includePersonalProjects: boolean;
    highlightKeywords: boolean;
  };
  setSettings: (settings: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  job: any;
}

export function DocumentSettings({
  settings,
  setSettings,
  onGenerate,
  isGenerating,
  job,
}: DocumentSettingsProps) {
  const handleToneChange = (value: string) => {
    setSettings({ ...settings, tone: value });
  };

  const handleFocusAreaToggle = (value: string) => {
    setSettings({
      ...settings,
      focusAreas: settings.focusAreas.includes(value)
        ? settings.focusAreas.filter((area) => area !== value)
        : [...settings.focusAreas, value],
    });
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Document Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Tone</Label>
          <RadioGroup
            value={settings.tone}
            onValueChange={handleToneChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional" className="cursor-pointer">
                Professional
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conversational" id="conversational" />
              <Label htmlFor="conversational" className="cursor-pointer">
                Conversational
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enthusiastic" id="enthusiastic" />
              <Label htmlFor="enthusiastic" className="cursor-pointer">
                Enthusiastic
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Focus Areas</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="technical-skills"
                checked={settings.focusAreas.includes("technical-skills")}
                onCheckedChange={() =>
                  handleFocusAreaToggle("technical-skills")
                }
              />
              <Label htmlFor="technical-skills" className="cursor-pointer">
                Technical Skills
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="experience"
                checked={settings.focusAreas.includes("experience")}
                onCheckedChange={() => handleFocusAreaToggle("experience")}
              />
              <Label htmlFor="experience" className="cursor-pointer">
                Work Experience
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="education"
                checked={settings.focusAreas.includes("education")}
                onCheckedChange={() => handleFocusAreaToggle("education")}
              />
              <Label htmlFor="education" className="cursor-pointer">
                Education
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="achievements"
                checked={settings.focusAreas.includes("achievements")}
                onCheckedChange={() => handleFocusAreaToggle("achievements")}
              />
              <Label htmlFor="achievements" className="cursor-pointer">
                Achievements
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Additional Options</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-projects"
                checked={settings.includePersonalProjects}
                onCheckedChange={(checked) =>
                  handleToggleChange(
                    "includePersonalProjects",
                    checked as boolean
                  )
                }
              />
              <Label htmlFor="include-projects" className="cursor-pointer">
                Include Personal Projects
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="highlight-keywords"
                checked={settings.highlightKeywords}
                onCheckedChange={(checked) =>
                  handleToggleChange("highlightKeywords", checked as boolean)
                }
              />
              <Label htmlFor="highlight-keywords" className="cursor-pointer">
                Highlight Job Keywords
              </Label>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1.5"
                >
                  <path d="m6 12 6-6 6 6-6 6-6-6Z" />
                  <path d="m2 22 3-3" />
                  <path d="M18 3h4v4" />
                  <path d="m21 3-3 3" />
                  <path d="M2 8V4h4" />
                </svg>
                {job.documents ? "Regenerate" : "Generate"} for {job.company}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
