"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb, Edit, Save, Plus, X } from "lucide-react";
import useSWR from "swr";

interface Skill {
  id: string;
  name: string;
  proficiencyLevel: number;
  category?: string;
}

interface SkillsProps {
  userId: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

export default function Skills({ userId }: SkillsProps) {
  const [editable, setEditable] = useState(false);
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [editedSkills, setEditedSkills] = useState<Skill[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState<Omit<Skill, "id">>({
    name: "",
    proficiencyLevel: 3,
    category: "Frontend", // Default category
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/skills`,
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      console.error("skill Data:", data);
      // Map the API response to match our component's expected format
      const mappedData = data.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        proficiencyLevel: skill.proficiencyLevel, // Map from API's proficiencyLevel to component's proficiency
        category: skill.category,
      }));
      setSkillsData(mappedData);
      setEditedSkills(JSON.parse(JSON.stringify(mappedData))); // Deep copy for editing
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
    field: keyof Skill,
    value: string | number
  ) => {
    setEditedSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const handleNewSkillChange = (
    field: keyof Omit<Skill, "id">,
    value: string | number
  ) => {
    setNewSkill((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewSkill({
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
  };

  const handleSaveNewSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/users/${userId}/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSkill),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add skill: ${errorData.error || response.statusText}`
        );
      }

      // Reset form and refresh data
      setIsAddingNew(false);
      setNewSkill({
        name: "",
        proficiencyLevel: 3,
        category: "Frontend",
      });

      // Refresh the data
      mutate();
    } catch (error) {
      console.error("Error adding skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete skill: ${response.statusText}`);
      }

      // Remove from local state and refresh data
      setEditedSkills(editedSkills.filter((skill) => skill.id !== id));
      mutate();
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill. Please try again.");
    }
  };

  const saveChanges = async () => {
    try {
      setIsSubmitting(true);

      for (const skill of editedSkills) {
        const response = await fetch(`/api/skills/${skill.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: skill.name,
            proficiencyLevel: skill.proficiencyLevel,
            category: skill.category,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            // Handle unauthorized - redirect to login
            window.location.href = "/login";
            return;
          }
          throw new Error(
            `Failed to update skill: ${errorData.error || response.statusText}`
          );
        }
      }

      setSkillsData(editedSkills);
      mutate();
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProficiencyLabel = (proficiencyLevel: number) => {
    switch (proficiencyLevel) {
      case 1:
        return "Beginner";
      case 2:
        return "Intermediate";
      case 3:
        return "Advanced";
      case 4:
        return "Expert";
      case 5:
        return "Master";
      default:
        return "Intermediate";
    }
  };

  if (isLoading) return <div>Loading skills...</div>;
  if (error) return <div>Error loading skills information</div>;

  // Group skills by category
  const groupedSkills = editedSkills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Skills
          </h3>

          <div className="flex gap-2">
            {!isAddingNew && !editable && (
              <Button variant="ghost" size="sm" onClick={handleAddNew}>
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              </Button>
            )}

            {editable ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditToggle}
                disabled={isSubmitting}
              >
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Done"}
                </>
              </Button>
            ) : (
              !isAddingNew && (
                <Button variant="ghost" size="sm" onClick={handleEditToggle}>
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                </Button>
              )
            )}
          </div>
        </div>

        {/* Add New Skill Form */}
        {isAddingNew && (
          <div className="mb-6 border-b pb-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Skill Name
                  </label>
                  <Input
                    value={newSkill.name}
                    onChange={(e) =>
                      handleNewSkillChange("name", e.target.value)
                    }
                    placeholder="e.g. JavaScript"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Category
                  </label>
                  <select
                    value={newSkill.category}
                    onChange={(e) =>
                      handleNewSkillChange("category", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Proficiency Level
                </label>
                <select
                  value={newSkill.proficiencyLevel}
                  onChange={(e) =>
                    handleNewSkillChange(
                      "proficiencyLevel",
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value={1}>Beginner</option>
                  <option value={2}>Intermediate</option>
                  <option value={3}>Advanced</option>
                  <option value={4}>Expert</option>
                  <option value={5}>Master</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={handleCancelAdd}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNewSkill}
                  disabled={!newSkill.name || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Skill"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {Object.entries(groupedSkills).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category} className="mb-4">
                <h4 className="text-md font-medium mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="relative">
                      {editable ? (
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleInputChange(
                                skill.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-32"
                          />
                          <select
                            value={skill.proficiencyLevel}
                            onChange={(e) =>
                              handleInputChange(
                                skill.id,
                                "proficiencyLevel",
                                Number(e.target.value)
                              )
                            }
                            className="p-1 border rounded"
                          >
                            <option value={1}>Beginner</option>
                            <option value={2}>Intermediate</option>
                            <option value={3}>Advanced</option>
                            <option value={4}>Expert</option>
                            <option value={5}>Master</option>
                          </select>
                          <select
                            value={skill.category || "Frontend"}
                            onChange={(e) =>
                              handleInputChange(
                                skill.id,
                                "category",
                                e.target.value
                              )
                            }
                            className="w-24 p-1 border rounded"
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Other">Other</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="h-8 w-8 text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="px-3 py-1">
                          {skill.name} -{" "}
                          {getProficiencyLabel(skill.proficiencyLevel)}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isAddingNew && (
            <div className="text-center py-4 text-muted-foreground">
              No skills found. Click "Add" to add your skills.
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
