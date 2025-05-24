"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AddButton } from "@/app/components/ui/AddButton";
import { EditButton } from "@/app/components/ui/EditButton";
import { DoneButton } from "@/app/components/ui/DoneButton";
import { NewSkill } from "@/app/components/Skills/NewSkill";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SkillForm } from "./Skills/List/SkillForm";
import { SkillItem } from "./Skills/List/SkillItem";
import { useSkillsContext } from "@/context/SkillsContext";

interface SkillsProps {
  userId: string;
}

export default function Skills({ userId }: SkillsProps) {
  const {
    isAdding,
    isEditing,
    isSubmitting,
    formData,
    isValidMap,
    isLoading,
    error,
    setIsAdding,
    setIsEditing,
    onUpdateBatch,
    onSaveNew,
    onChangeFormData,
    onDelete,
  } = useSkillsContext();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading skills information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
          <div className="flex gap-2">
            {!isAdding && !isEditing && (
              <AddButton onClick={() => setIsAdding(true)} />
            )}
            {!isEditing && !isAdding && (
              <EditButton onClick={() => setIsEditing(true)} />
            )}
            {isEditing && (
              <DoneButton
                onClick={onUpdateBatch}
                isSubmitting={isSubmitting}
                disabled={
                  !Array.from(isValidMap.values()).every((isValid) => isValid)
                }
              />
            )}
          </div>
        </div>

        {isAdding && (
          <NewSkill
            onSaveNewSkill={onSaveNew}
            userId={userId}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {!isEditing ? (
          <>
            {formData.length > 0 &&
              formData.map((skill) => (
                <div
                  key={skill.id}
                  className="relative border-b pb-4 last:border-0"
                >
                  <SkillItem skill={skill} />
                </div>
              ))}
          </>
        ) : (
          <>
            {formData.map((skill) => (
              <div key={skill.id}>
                <SkillForm
                  onChangeFormData={onChangeFormData}
                  skill={skill}
                  onDelete={onDelete}
                  isEditing={isEditing}
                />
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
