"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Education } from "./Educations/educations.types";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewEducation } from "./Educations/NewEducation/NewEducation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import { EducationItem } from "./Educations/List/EducationItem";
import { EducationForm } from "./Educations/List/EducationForm";

// Helper to adapt Education type to match EducationItem requirements
const adaptEducationForItem = (education: Education) => ({
  institution: education.institution,
  degree: education.degree,
  fieldOfStudy: education.fieldOfStudy,
  startYear: education.startYear,
  endYear: education.endYear,
  description: education.description,
});

interface EducationsProps {
  userId: string;
}

export default function Educations({ userId }: EducationsProps) {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const [educationsData, setEducationsData] = useState<Education[]>([]);
  const [formData, setFormData] = useState<Education[]>([]);
  const [changedEducationId, setChangedEducationId] = useState<Set<string>>(
    new Set()
  );
  const [isEducationValidMap, setIsEducationValidMap] = useState<
    Map<string, boolean>
  >(new Map());
  const { data, isLoading, error, mutate } = useFetchData<Education[]>(
    `/api/users/${userId}/educations`
  );

  useEffect(() => {
    if (data) {
      setEducationsData(data);
      setFormData(data);
    }
  }, [data]);

  const onAddNewEducation = () => setIsAddingNewItem(true);

  const onDeleteEducationList = async (id: string | null) => {
    if (!window.confirm("Are you sure you want to delete this education?")) {
      return;
    }

    try {
      setIsSubmittingItem(true);

      const response = await fetch(`/api/educations/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete education");
      }

      toast.success("Education deleted successfully");
      mutate(); // Refresh the data
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error(
        error instanceof Error ? error.message : "Error deleting education"
      );
    } finally {
      setIsSubmittingItem(false);
    }
  };

  const updateEducation = async (id: string, educationObject: Education) => {
    const response = await fetch(`/api/educations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(educationObject),
    });
  };

  const onUpdateEducationList = async () => {
    setIsSubmittingItem(true);
    setIsEditingMode(true);

    try {
      formData.forEach((education) => {
        if (changedEducationId.has(education.id)) {
          updateEducation(education.id, education);
        }
      });
    } catch (error) {
      console.error("Error updating educations:", error);
      toast.error("Error updating educations");
    } finally {
      mutate();
      setIsSubmittingItem(false);
      setIsEditingMode(false);
    }
  };

  const onSaveNewEducation = async (educationObject: Education) => {
    try {
      setIsSubmittingItem(true);
      setIsAddingNewItem(false);

      const response = await fetch(`/api/educations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(educationObject),
      });

      if (!response.ok) {
        throw new Error("Failed to add education");
      }

      const data = await response.json();
      console.log("data", data);
      toast.success("Education added successfully");

      setIsSubmittingItem(false);
    } catch (error) {
      console.error("Error adding new education:", error);
      toast.error("Error adding new education");
    } finally {
      mutate();
      setIsSubmittingItem(false);
    }
  };

  const onEducationChange = (
    id: string,
    field: string,
    value: string,
    isFormValid: boolean
  ) => {
    setFormData((prev) => {
      return prev.map((education) => {
        setIsEducationValidMap((prev) => {
          prev.set(id, isFormValid);
          return prev;
        });
        if (education.id === id) {
          setChangedEducationId((prev) => {
            prev.add(id);
            return prev;
          });
          return { ...education, [field]: value };
        }
        return education;
      });
    });
  };

  const EducationItemContent = (
    <>
      {!isLoading &&
        !error &&
        educationsData &&
        educationsData.length > 0 &&
        educationsData.map((education: Education) => (
          <div
            key={education.id}
            className="relative border-b pb-4 last:border-0"
          >
            <EducationItem education={adaptEducationForItem(education)} />
          </div>
        ))}
    </>
  );

  const EducationFormContent = (
    <>
      {formData.map((education: Education) => {
        return (
          <div key={education.id}>
            <EducationForm
              onFormChange={onEducationChange}
              education={education}
              onDeleteClick={onDeleteEducationList}
            />
          </div>
        );
      })}
    </>
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading educations information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Education</h3>
          <div className="flex gap-2">
            {!isAddingNewItem && !isEditingMode && (
              <AddButton onClick={onAddNewEducation} />
            )}
            {!isEditingMode && !isAddingNewItem && (
              <EditButton
                onClick={() => {
                  setIsEditingMode(true);
                }}
              />
            )}
            {isEditingMode && (
              <DoneButton
                onClick={onUpdateEducationList}
                isSubmitting={isSubmittingItem}
                disabled={
                  !isEducationValidMap.values().every((isValid) => isValid)
                }
              />
            )}
          </div>
        </div>

        {isAddingNewItem && (
          <NewEducation
            userId={userId}
            onSaveNewEducation={onSaveNewEducation}
          />
        )}

        {!isEditingMode ? (
          <>{EducationItemContent}</>
        ) : (
          <>{EducationFormContent}</>
        )}
      </CardContent>
    </Card>
  );
}
