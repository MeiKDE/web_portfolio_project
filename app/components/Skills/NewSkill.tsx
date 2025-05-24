import { useState } from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { Skill } from "@/app/components/Skills/skills.types";
import * as React from "react";
import { CancelBtn } from "@/app/components/ui/CancelBtn";
import { SaveBtn } from "@/app/components/ui/SaveBtn";

interface NewSkillProps {
  userId: string;
  createNew: (skill: Skill) => void | Promise<void>;
  onCancel?: () => void;
}

export function NewSkill({ userId, createNew, onCancel }: NewSkillProps) {
  // For useFormValidation
  const initialValues = {
    name: "",
    category: "",
    proficiencyLevel: "",
  };

  // For useFormValidation
  const validationRules = {
    name: (value: string) =>
      value.length > 0 ? null : "Skill name is required",
    category: (value: string) =>
      value.length > 0 ? null : "Category is required",
    proficiencyLevel: (value: string) => {
      const numValue = parseInt(value);
      return numValue >= 1 && numValue <= 5
        ? null
        : "Proficiency level must be between 1 and 5";
    },
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { values, errors, handleChange, validateForm, resetForm } =
    useFormValidation({
      initialValues,
      validationRules,
      validateOnChange: true,
      validateOnBlur: true,
    });

  const getSkillModel = (): Skill => ({
    id: "",
    userId,
    name: values.name,
    category: values.category,
    proficiencyLevel: parseInt(values.proficiencyLevel),
  });

  const createSkillHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    await createNew(getSkillModel());
    resetForm();
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  const getInputClassName = (field: string) =>
    errors[field as keyof typeof errors] ? "border-red-500" : "";

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Skill</h4>
      <form onSubmit={createSkillHandler} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Skill Name*</label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName("name")}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Category*</label>
          <input
            type="text"
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "category"
            )}`}
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Proficiency Level* (1-5)
          </label>
          <input
            type="number"
            min={1}
            max={5}
            value={values.proficiencyLevel}
            onChange={(e) => handleChange("proficiencyLevel", e.target.value)}
            className={`w-full p-2 border rounded ${getInputClassName(
              "proficiencyLevel"
            )}`}
          />
          {errors.proficiencyLevel && (
            <p className="text-red-500 text-xs mt-1">
              {errors.proficiencyLevel}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <CancelBtn resetForm={handleCancel} />
          <SaveBtn isSubmitting={isSubmitting} component="Skill" />
        </div>
      </form>
    </div>
  );
}
