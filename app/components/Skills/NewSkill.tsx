import { CancelSave } from "@/app/components/ui/CancelSave";
import { useState } from "react";
import { NameInput } from "@/app/components/Skills/NewSkill/NameInput";
import { CategoryInput } from "@/app/components/Skills/NewSkill/CategoryInput";
import { ProficiencyInput } from "@/app/components/Skills/NewSkill/ProficiencyInput";
import { Skill } from "@/app/components/Skills/skills.types";
import React from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";

interface NewSkillProps {
  userId: string;
  onSaveNewSkill: (values: Skill) => void | Promise<void>;
}

export function NewSkill({ userId, onSaveNewSkill }: NewSkillProps) {
  const formValues = {
    name: "",
    category: "",
    proficiencyLevel: "",
  };

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({
    name: false,
    category: false,
    proficiencyLevel: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Default is false

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation(formValues, {
    name: (value) => (value.length > 0 ? null : "Name is required"),
    category: (value) => (value.length > 0 ? null : "Category is required"),
    proficiencyLevel: (value) =>
      value >= 1 && value <= 5
        ? null
        : "Proficiency level must be between 1 and 5",
  });

  const getSkillModel = (values: any) => {
    return {
      id: "",
      userId,
      name: values.name,
      proficiencyLevel: parseInt(values.proficiencyLevel),
      category: values.category,
    };
  };

  // When click on SAVE button, the defaultSkillModel will be used to create a new skill data
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Default is false

    // Validate the form
    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    onSaveNewSkill(getSkillModel(values)); // pass the values to the onClickSave function
  };

  // The getInputClassName function is used to get the input class name
  // which is used to style the input field
  const getInputClassName = (field: string) => {
    return errors[field as keyof typeof errors] ? "border-red-500" : "";
  };

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Skill</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Skill Name*</label>
          <NameInput
            values={values} // The values of the input fields
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            } // The function to handle the change of the input fields
            setTouchedFields={(fields) => setTouchedFields(fields)} // The function to set the touched fields
            getInputClassName={getInputClassName} // The function to get the input class name
          />
          {errors["name"] && (
            <p className="text-red-500 text-xs mt-1">{errors["name"]}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Category*</label>
          <CategoryInput
            values={values} // The values of the input fields
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            } // The function to handle the change of the input fields
            setTouchedFields={setTouchedFields} // The function to set the touched fields
            getInputClassName={getInputClassName} // The function to get the input class name
          />
          {errors["category"] && (
            <p className="text-red-500 text-xs mt-1">{errors["category"]}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Proficiency Level* (1-5)
          </label>
          <ProficiencyInput
            values={values} // The values of the input fields
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            } // The function to handle the change of the input fields
            setTouchedFields={setTouchedFields} // The function to set the touched fields
            getInputClassName={getInputClassName} // The function to get the input class name
          />
          {errors["proficiencyLevel"] && (
            <p className="text-red-500 text-xs mt-1">
              {errors["proficiencyLevel"]}
            </p>
          )}
        </div>

        <CancelSave
          isSubmitting={isSubmitting} // Set isSubmitting to true when the user clicks on the SAVE button
          resetForm={() => {
            onSaveNewSkill(getSkillModel(values)); // Call the onSaveNewSkill function to save the skill data
          }}
        />
      </form>
    </div>
  );
}
