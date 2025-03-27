import { Input } from "@/components/ui/input";
import { CancelSaveButtons } from "./CancelSaveButtons";
import { Skill } from "../Interface";
import { useState } from "react";
import { SaveNewSkill } from "../SaveNewSkill";
import { useFetchData } from "@/app/hooks/data/use-fetch-data";
import { CancelAdd } from "../CancelAdd";
import { FormValidation } from "./FormValidation";

interface NewSkillProps {
  userId: string;
}

export function NewSkill({ userId }: NewSkillProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editedData, setEditedData] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<Record<string, any>>({
    name: "",
    proficiencyLevel: 3,
    category: "Frontend",
  });

  const skillToValidate: Skill = {
    id: "",
    userId: userId,
    name: values.name || "",
    category: values.category || "",
    proficiencyLevel: values.proficiencyLevel || 3,
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Create a skill object for validation
    const skillToValidate: Skill = {
      id: "",
      userId: userId,
      name: values.name,
      category: values.category,
      proficiencyLevel: parseInt(String(values.proficiencyLevel)),
    };

    if (!skillToValidate.name?.trim()) {
      newErrors.name = "Skill name is required";
      isValid = false;
    }

    if (!skillToValidate.category?.trim()) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (
      !skillToValidate.proficiencyLevel ||
      skillToValidate.proficiencyLevel < 1 ||
      skillToValidate.proficiencyLevel > 10
    ) {
      newErrors.proficiencyLevel = "Proficiency level must be between 1 and 10";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const touchField = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const { data, isLoading, error, mutate } = useFetchData<Skill[]>(
    `/api/users/${userId}/skills`
  );

  const resetForm = () => {
    setValues({
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    });
    setTouchedFields({});
    setFormErrors({});
  };

  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setFormErrors({});
    setTouchedFields({});
  };

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const getInputClassName = (id: string, field: string, baseClass: string) => {
    const hasError = touchedFields[field] && formErrors[field];
    return `${baseClass} ${hasError ? "border-red-500" : ""}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // touchField("name");
    // touchField("category");
    // touchField("proficiencyLevel");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await SaveNewSkill(
        e,
        validateForm,
        values,
        touchField,
        mutate,
        resetForm,
        cancelAddingNew
      );
      setIsSubmitting(false);
      setSaveSuccess(true);
      setIsAddingNew(false);
      await mutate();
    } catch (error) {
      console.error("Error saving skill:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Skill</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Skill Name*</label>
          <Input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => touchField("name")}
            className={getInputClassName("name", "name", "mt-1")}
            placeholder="e.g., JavaScript, React, Agile"
          />
          {formErrors["name"] && (
            <p className="text-red-500 text-xs mt-1">{formErrors["name"]}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Category*</label>
          <Input
            type="text"
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            onBlur={() => touchField("category")}
            className={getInputClassName("category", "category", "mt-1")}
            placeholder="e.g., Frontend, Backend, DevOps"
          />
          {formErrors["category"] && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors["category"]}
            </p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Proficiency Level* (1-10)
          </label>
          <Input
            type="number"
            min="1"
            max="10"
            value={values.proficiencyLevel}
            onChange={(e) => handleChange("proficiencyLevel", e.target.value)}
            onBlur={() => touchField("proficiencyLevel")}
            className={getInputClassName(
              "proficiencyLevel",
              "proficiencyLevel",
              "mt-1"
            )}
          />
          {formErrors["proficiencyLevel"] && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors["proficiencyLevel"]}
            </p>
          )}
        </div>

        <FormValidation skill={skillToValidate} touchedFields={touchedFields} />

        <CancelSaveButtons
          cancelAddingNew={cancelAddingNew}
          isSubmitting={isSubmitting}
          CancelAdd={CancelAdd}
          resetForm={resetForm}
        />
      </form>
    </div>
  );
}
