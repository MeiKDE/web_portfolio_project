"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Edit, Save } from "lucide-react";
import useSWR from "swr";

interface Education {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  description?: string;
}

interface EducationProps {
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Educations({ userId }: EducationProps) {
  const [editable, setEditable] = useState(false);
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [editedEducation, setEditedEducation] = useState<Education[]>([]);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/education`,
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setEducationData(data);
      setEditedEducation(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    }
  }, [data]);

  const handleEditToggle = () => {
    if (editable) {
      saveChanges();
    }
    setEditable(!editable);
  };

  const handleInputChange = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setEditedEducation((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const saveChanges = async () => {
    try {
      for (const education of editedEducation) {
        console.log("Updating education:", education); // Log the data before update

        // Create a modified payload with startYear converted to integer
        const payload = {
          institution: education.institution,
          degree: education.degree,
          startYear: parseInt(education.startYear, 10), // Convert string to integer
          description: education.description,
        };

        console.log("Sending payload:", payload); // Log the converted payload

        const response = await fetch(`/api/education/${education.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to update education: ${response.statusText}`);
        }

        const updatedEducation = await response.json();
        console.log("Updated education response:", updatedEducation); // Log the response
      }

      // Update local state with the edited data
      setEducationData(editedEducation);
      console.log("Updated education data:", editedEducation); // Log the updated state
      mutate(); // Re-fetch data to ensure consistency
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  if (isLoading) return <div>Loading education...</div>;
  if (error) return <div>Error loading education information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Education
          </h3>
          {editable ? (
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

        {educationData.length > 0 ? (
          (editable ? editedEducation : educationData).map((edu, index) => (
            <div key={edu.id} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={"/placeholder.svg?height=48&width=48"}
                    alt="University logo"
                  />
                  <AvatarFallback>
                    {edu.institution.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                {editable ? (
                  <>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        handleInputChange(edu.id, "institution", e.target.value)
                      }
                      className="font-semibold mb-2"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        handleInputChange(edu.id, "degree", e.target.value)
                      }
                      className="text-muted-foreground mb-2"
                    />
                    <input
                      type="text"
                      value={edu.startYear}
                      onChange={(e) =>
                        handleInputChange(edu.id, "startYear", e.target.value)
                      }
                      className="text-sm text-muted-foreground mb-2"
                    />
                    <textarea
                      value={edu.description || ""}
                      onChange={(e) =>
                        handleInputChange(edu.id, "description", e.target.value)
                      }
                      className="mt-2"
                      rows={4}
                    />
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold">{edu.institution}</h4>
                    <p className="text-muted-foreground">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground">
                      {edu.startYear}
                    </p>
                    {edu.description && (
                      <p className="mt-2">{edu.description}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-sm">
            No education information available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
