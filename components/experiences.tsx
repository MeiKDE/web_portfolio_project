"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Edit,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  X,
  Save,
} from "lucide-react";
import useSWR from "swr";

interface Experience {
  id: string;
  title: string; // Keeping in interface for API compatibility
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

//Defines the props for the Experience component, which includes a userId.
interface ExperienceProps {
  userId: string;
}

//A utility function fetcher is defined to fetch data from a given URL and parse it as JSON.
const fetcher = (url: string) => fetch(url).then((res) => res.json());

//The Experience component is defined as a functional component that takes userId as a prop.
export default function Experiences({ userId }: ExperienceProps) {
  // A state variable error is initialized to null.
  const [localError, setLocalError] = useState<string | null>(null);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExperiences, setEditedExperiences] = useState<Experience[]>([]);

  //The useSWR hook is used to fetch the experiences data from the API.
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/experiences`,
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setExperienceData(data);
      setEditedExperiences(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    }
  }, [data]);

  // Get current date in YYYY-MM-DD format for date input max attribute
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Utility function to format date to ISO-8601 format
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      saveChanges();
    } else {
      setEditedExperiences(
        experienceData.map((exp) => ({
          ...exp,
          startDate: exp.startDate
            ? formatDate(exp.startDate)
            : getCurrentDate(),
          endDate: exp.endDate ? formatDate(exp.endDate) : getCurrentDate(),
        }))
      );
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    id: string,
    field: keyof Experience,
    value: string | null
  ) => {
    setEditedExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const saveChanges = async () => {
    try {
      for (const experience of editedExperiences) {
        console.log("ln104: Updating experience:", experience); // Log the data
        const response = await fetch(`/api/experiences/${experience.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: experience.company,
            startDate: formatDate(experience.startDate),
            endDate: experience.endDate ? formatDate(experience.endDate) : null,
            description: experience.description,
            // Add any other fields you want to update
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to update experience: ${response.statusText}`
          );
        }
      }

      setExperienceData(editedExperiences);
      mutate();
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
      } else {
        setLocalError("An unknown error occurred while saving changes");
      }
      console.error("Error saving changes:", error);
    }
  };

  if (isLoading) return <div>Loading experiences...</div>;
  if (error) return <div>Error loading experiences: {error.message}</div>;
  if (localError) return <div>Error: {localError}</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Experience
          </h3>

          {isEditing ? (
            <Button variant="ghost" size="sm" onClick={handleEditToggle}>
              <>
                <Save className="h-4 w-4 mr-2" />
                Done
              </>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleEditToggle}>
              {" "}
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </>
            </Button>
          )}
        </div>

        {(isEditing ? editedExperiences : experienceData) &&
        (isEditing ? editedExperiences : experienceData).length > 0 ? (
          (isEditing ? editedExperiences : experienceData).map(
            (experience: Experience, index: number) => (
              <div
                key={experience.id}
                className={`mb-6 ${
                  index < experienceData.length - 1 ? "border-b pb-6" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {experience.company.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-grow">
                    {isEditing ? (
                      <>
                        <Input
                          value={experience.company}
                          onChange={(e) =>
                            handleInputChange(
                              experience.id,
                              "company",
                              e.target.value
                            )
                          }
                          className="text-muted-foreground mb-2"
                        />
                        <div className="flex gap-2 mb-2">
                          <Input
                            type="date"
                            value={experience.startDate}
                            onChange={(e) =>
                              handleInputChange(
                                experience.id,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="text-sm text-muted-foreground w-1/2"
                            max={getCurrentDate()}
                          />
                          <Input
                            type="date"
                            value={experience.endDate || ""}
                            onChange={(e) =>
                              handleInputChange(
                                experience.id,
                                "endDate",
                                e.target.value || null
                              )
                            }
                            className="text-sm text-muted-foreground w-1/2"
                            placeholder="Present"
                            max={getCurrentDate()}
                          />
                        </div>
                        <Textarea
                          value={experience.description}
                          onChange={(e) =>
                            handleInputChange(
                              experience.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="mt-2"
                          rows={4}
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          {experience.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {experience.startDate} -{" "}
                          {experience.endDate || "Present"}
                        </p>
                        <p className="mt-2">{experience.description}</p>
                      </>
                    )}

                    {/* AI Suggestion for the first item as an example */}
                    {!isEditing && index === 0 && (
                      <div className="mt-3 p-3 bg-muted rounded-md border border-border">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-grow">
                            <p className="text-sm font-medium">
                              AI Suggestion:
                            </p>
                            <p className="text-sm">
                              Replace "Led development" with a stronger action
                              verb like "Spearheaded" or "Architected" to
                              showcase leadership.
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Regenerate
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No experience entries found. Add your work history to complete your
            profile.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
