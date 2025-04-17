"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Experience } from "@/app/components/Experiences/experiences.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewExperience } from "@/app/components/Experiences/NewExperience";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import { ExperienceItem } from "./Experiences/List/ExperienceItem";
import { ExperienceForm } from "./Experiences/List/ExperienceForm";
import { Briefcase } from "lucide-react";
import * as React from "react";

interface ExperiencesProps {
  userId: string;
}

export default function Experiences({ userId }: ExperiencesProps) {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const [experiencesData, setExperiencesData] = useState<Experience[]>([]);
  const [formData, setFormData] = useState<Experience[]>([]);
  const [changedExperienceId, setChangedExperienceId] = useState<Set<string>>(
    new Set()
  );
  const [isExperienceValidMap, setIsExperienceValidMap] = useState<
    Map<string, boolean>
  >(new Map());

  const { data, isLoading, error, mutate } = useFetchData<Experience[]>(
    `/api/users/${userId}/experiences`
  );

  useEffect(() => {
    if (data) {
      setExperiencesData(data);
      setFormData(data);
    }
  }, [data]);

  const onAddNewExperience = () => setIsAddingNewItem(true);

  const onDeleteExperienceList = async (id: string | null) => {
    try {
      setIsSubmittingItem(true);
      const response = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete experience");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Error deleting experience");
    } finally {
      mutate();
      setIsSubmittingItem(false);
    }
  };

  const updateExperience = async (id: string, experienceObject: Experience) => {
    const response = await fetch(`/api/experiences/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(experienceObject),
    });
  };

  const onUpdateExperienceList = async () => {
    setIsSubmittingItem(true);
    setIsEditingMode(true);

    try {
      formData.forEach((experience) => {
        if (changedExperienceId.has(experience.id)) {
          updateExperience(experience.id, experience);
        }
      });
    } catch (error) {
      console.error("Error updating experiences:", error);
      toast.error("Error updating experiences");
    } finally {
      mutate();
      setIsSubmittingItem(false);
      setIsEditingMode(false);
    }
  };

  const onExperienceChange = (
    id: string,
    field: string,
    value: string | boolean,
    isFormValid: boolean
  ) => {
    setFormData((prev) => {
      return prev.map((experience) => {
        setIsExperienceValidMap((prev) => {
          prev.set(id, isFormValid);
          return prev;
        });
        if (experience.id === id) {
          setChangedExperienceId((prev) => {
            prev.add(id);
            return prev;
          });
          return { ...experience, [field]: value };
        }
        return experience;
      });
    });
  };

  const onSaveNewExperience = async (experienceObject: Experience) => {
    try {
      setIsSubmittingItem(true);
      setIsAddingNewItem(false);

      const response = await fetch(`/api/experiences/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experienceObject),
      });

      if (!response.ok) {
        throw new Error("Failed to add experience");
      }

      toast.success("Experience added successfully");
    } catch (error) {
      console.error("Error adding new experience:", error);
      toast.error("Error adding new experience");
    } finally {
      mutate();
      setIsSubmittingItem(false);
    }
  };

  let ExperienceItemContent;
  let ExperienceFormContent;

  if (!isEditingMode) {
    ExperienceItemContent = (
      <>
        {!isLoading &&
          !error &&
          experiencesData &&
          experiencesData.length > 0 &&
          experiencesData.map((experience) => (
            <div
              key={experience.id}
              className="relative border-b pb-4 last:border-0"
            >
              <ExperienceItem experience={experience} />
            </div>
          ))}
      </>
    );
  } else {
    ExperienceFormContent = (
      <>
        {formData.map((experience) => (
          <div key={experience.id}>
            <ExperienceForm
              onFormChange={onExperienceChange}
              experience={experience}
              onDeleteClick={onDeleteExperienceList}
            />
          </div>
        ))}
      </>
    );
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading experiences information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Experience
          </h3>

          <div className="flex gap-2">
            {!isAddingNewItem && !isEditingMode && (
              <AddButton onClick={onAddNewExperience} />
            )}
            {!isAddingNewItem && !isEditingMode && (
              <EditButton onClick={() => setIsEditingMode(true)} />
            )}
            {isEditingMode && (
              <DoneButton
                onClick={onUpdateExperienceList}
                isSubmitting={isSubmittingItem}
                disabled={
                  !isExperienceValidMap.values().every((isValid) => isValid)
                }
              >
                {isSubmittingItem ? "Saving..." : "Done"}
                {isSubmittingItem && (
                  <span className="ml-2 inline-block">
                    <LoadingSpinner size="sm" text="" />
                  </span>
                )}
              </DoneButton>
            )}
          </div>
        </div>

        {isAddingNewItem && (
          <NewExperience
            userId={userId}
            onSaveNewExperience={onSaveNewExperience}
          />
        )}

        {ExperienceItemContent}
        {ExperienceFormContent}
      </CardContent>
    </Card>
  );
}
