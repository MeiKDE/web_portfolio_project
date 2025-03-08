"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Edit, Save, Plus, X } from "lucide-react";
import useSWR from "swr";

interface Skill {
  id: string;
  name: string;
  proficiency: number;
  category?: string;
}

interface SkillsProps {
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Skills({ userId }: SkillsProps) {
  const [editable, setEditable] = useState(false);
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [editedSkills, setEditedSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    proficiency: 3,
    category: "Frontend", // Default category
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/skills`,
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setSkillsData(data);
      setEditedSkills(JSON.parse(JSON.stringify(data))); // Deep copy for editing
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

  const handleNewSkillChange = (field: keyof Skill, value: string | number) => {
    setNewSkill((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    // This would typically generate a temporary ID until saved to the backend
    const tempId = `temp-${Date.now()}`;
    const skillToAdd = { ...newSkill, id: tempId };
    setEditedSkills([...editedSkills, skillToAdd]);
    setNewSkill({ name: "", proficiency: 3, category: "Frontend" });
  };

  const handleRemoveSkill = (id: string) => {
    setEditedSkills(editedSkills.filter((skill) => skill.id !== id));
  };

  const saveChanges = async () => {
    try {
      // Handle updates for existing skills
      const updatePromises = editedSkills
        .filter(
          (skill) =>
            !skill.id.startsWith("temp-") &&
            skillsData.some((s) => s.id === skill.id)
        )
        .map((skill) => {
          return fetch(`/api/skills/${skill.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: skill.name,
              proficiency: Number(skill.proficiency),
              category: skill.category,
            }),
          });
        });

      // Handle creation of new skills
      const createPromises = editedSkills
        .filter((skill) => skill.id.startsWith("temp-"))
        .map((skill) => {
          return fetch(`/api/skills`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: skill.name,
              proficiency: Number(skill.proficiency),
              category: skill.category,
              userId: userId,
            }),
          });
        });

      // Handle deletions (skills that were in original data but not in edited data)
      const deletePromises = skillsData
        .filter((skill) => !editedSkills.some((s) => s.id === skill.id))
        .map((skill) => {
          return fetch(`/api/skills/${skill.id}`, {
            method: "DELETE",
          });
        });

      await Promise.all([
        ...updatePromises,
        ...createPromises,
        ...deletePromises,
      ]);

      // Update local state and refetch data
      mutate();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const getProficiencyLabel = (proficiency: number) => {
    switch (proficiency) {
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
          <div className="flex items-center gap-2">
            {editable ? (
              <Button variant="ghost" size="sm" onClick={handleEditToggle}>
                <Save className="h-4 w-4 mr-2" />
                Done
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditable(true)}
                  className="text-muted-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={handleEditToggle}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

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
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleInputChange(
                                skill.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-32 p-1 border rounded"
                          />
                          <select
                            value={skill.proficiency}
                            onChange={(e) =>
                              handleInputChange(
                                skill.id,
                                "proficiency",
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
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Frontend">Frontend</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSkill(skill.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="px-3 py-1">
                          {skill.name} -{" "}
                          {getProficiencyLabel(skill.proficiency)}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            No skills information available
          </div>
        )}

        {editable && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-md font-medium mb-2">Add New Skill</h4>
            <div className="flex flex-wrap gap-2 items-end">
              <div>
                <label className="text-sm block mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => handleNewSkillChange("name", e.target.value)}
                  placeholder="e.g. JavaScript"
                  className="p-1 border rounded"
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Proficiency</label>
                <select
                  value={newSkill.proficiency}
                  onChange={(e) =>
                    handleNewSkillChange("proficiency", Number(e.target.value))
                  }
                  className="p-1 border rounded"
                >
                  <option value={1}>Beginner</option>
                  <option value={2}>Intermediate</option>
                  <option value={3}>Advanced</option>
                  <option value={4}>Expert</option>
                  <option value={5}>Master</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) =>
                    handleNewSkillChange("category", e.target.value)
                  }
                  className="p-1 border rounded"
                >
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Frontend">Frontend</option>
                </select>
              </div>
              <Button
                onClick={handleAddSkill}
                disabled={!newSkill.name}
                size="sm"
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
