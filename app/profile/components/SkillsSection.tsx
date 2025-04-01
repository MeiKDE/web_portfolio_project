"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skill } from "./skills/Interface";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { AddButton } from "./ui/AddButton";
import { EditButton } from "./ui/EditButton";
import { DoneButton } from "./ui/DoneButton";
import { FormValidation } from "./skills/add/child/new-skill/FormValidation";
import { NewSkill } from "./skills/add/NewSkill";
import { SkillList } from "./skills/display/List";
interface SkillsProps {
  userId: string; // This is mapped to session.user.id from page.tsx
}

export default function Skills({ userId }: SkillsProps) {
  const defaultSkillValues = {
    name: "",
    proficiencyLevel: 3,
    category: "Frontend",
  };
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [values, setValues] = useState(defaultSkillValues);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedData, setEditedData] = useState<Skill[]>([]);

  const onClickAddNew = () => {
    setIsAddingNew(true);
    setValues(values);
  };

  const onDeleteSkillList = async (id: string | null) => {
    setIsEditing(true);
    setIsAddingNew(false);

    const response = await fetch(`/api/skills/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    console.log("data", data);
    mutate();
  };

  const onUpdateSkillList = async () => {
    setIsSubmitting(true);
    setIsEditing(false);
    setIsAddingNew(false);

    const response = await fetch(`/api/skills/${userId}`, {
      method: "PUT",
      body: JSON.stringify(editedData),
    });

    const data = await response.json();
    console.log("data", data);
    mutate();
  };

  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/skills/${userId}`
  );

  console.log("data", data);

  const onSaveNewSkill = async (values: Skill) => {
    setIsSubmitting(true);
    setIsAddingNew(false);

    const response = await fetch(`/api/skills/`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();
    console.log("data", data);
    mutate();
  };

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
          <div className="flex gap-2">
            {/* Button will be hidden when adding or editing */}
            {!isAddingNew && !isEditing && (
              <AddButton onClick={onClickAddNew} />
            )}

            {isEditing ? (
              <DoneButton
                onClick={onUpdateSkillList}
                isSubmitting={isSubmitting}
              />
            ) : (
              !isAddingNew && (
                <>
                  <EditButton onClick={() => onDeleteSkillList(null)} />
                </>
              )
            )}
          </div>
        </div>

        {/* Add validation error messages */}
        {isEditing &&
          editedData?.map((skill: Skill, index: number) => (
            <FormValidation key={skill.id} skill={skill} />
          ))}

        {/* Add New Skill Entry */}
        {isAddingNew && (
          <NewSkill userId={userId} onSaveNewSkill={onSaveNewSkill} />
        )}

        {/* Skills List */}
        {!isLoading && !error && (
          <>
            {editedData && editedData.length > 0 ? (
              <SkillList
                editedData={editedData.filter(
                  (skill) => skill.userId === userId
                )}
                isEditing={isEditing}
                mutate={mutate}
                userId={userId}
              />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No skills added yet.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
