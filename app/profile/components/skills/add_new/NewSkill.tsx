import { Input } from "@/components/ui/input";
import { CancelSave } from "./CancelSave";
import { useState } from "react";
import { SaveNewSkill } from "../SaveNewSkill";
import { FormValidation } from "./FormValidation";

interface NewSkillProps {
  userId: string;
  onSave: () => void;
}

export function NewSkill({ userId, onSave }: NewSkillProps) {
  // const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  // const [editedData, setEditedData] = useState<Skill[]>([]);
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

  const resetForm = () => {
    setValues({
      name: "",
      proficiencyLevel: 3,
      category: "Frontend",
    });
    setTouchedFields({}); // Reset touched fields
    setFormErrors({}); // Reset form errors
  };

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value })); // update prev values with new value
  };

  // Get the input error class name
  const getInputClassName = (id: string, field: string, baseClass: string) => {
    // Check if the field has been touched and if it has an error
    const hasError = touchedFields[field] && formErrors[field];
    return `${baseClass} ${hasError ? "border-red-500" : ""}`;
  };

  // Submit the form
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate raw input values
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate name
    if (!values.name || values.name.trim() === "") {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate category
    if (!values.category || values.category.trim() === "") {
      errors.category = "Category is required";
      isValid = false;
    }

    // Validate proficiency level
    const proficiencyLevel = parseInt(String(values.proficiencyLevel));
    if (
      isNaN(proficiencyLevel) ||
      proficiencyLevel < 1 ||
      proficiencyLevel > 5
    ) {
      errors.proficiencyLevel = "Proficiency level must be between 1 and 5";
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = {
        name: values.name.trim(),
        category: values.category.trim(),
        proficiencyLevel: parseInt(values.proficiencyLevel.toString()),
      };
      e.preventDefault();
      await SaveNewSkill(postData);
      resetForm();
    } catch (error) {
      console.error("Error saving skill:", error);
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
            onBlur={() => setTouchedFields((prev) => ({ ...prev, name: true }))}
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
            onBlur={() =>
              setTouchedFields((prev) => ({ ...prev, category: true }))
            }
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
            onBlur={() =>
              setTouchedFields((prev) => ({ ...prev, proficiencyLevel: true }))
            }
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

        {/* Create a skill object for validation */}
        <FormValidation
          skill={{
            id: "",
            userId,
            name: values.name || "",
            category: values.category || "",
            proficiencyLevel: parseInt(String(values.proficiencyLevel)) || 3,
          }}
          touchedFields={touchedFields}
        />

        <CancelSave isSubmitting={isSubmitting} resetForm={resetForm} />
      </form>
    </div>
  );
}
