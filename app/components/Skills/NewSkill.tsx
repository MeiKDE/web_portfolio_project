import { useState } from "react";
import { Skill } from "@/app/components/Skills/skills.types";
import React from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { CancelBtn } from "@/app/components/ui/CancelBtn";
import { SaveBtn } from "@/app/components/ui/SaveBtn";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormErrorMessage } from "@/app/components/ui/FormErrorMessage";

interface NewSkillProps {
  userId: string;
  onSaveNewSkill: (values: Skill) => void | Promise<void>;
  onCancel: () => void;
}

export function NewSkill({ userId, onSaveNewSkill, onCancel }: NewSkillProps) {
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

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Skill</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Skill Name*</label>
          <FormInput
            field="name"
            value={values.name}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("name")}
            required
          />
          <FormErrorMessage error={errors["name"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Category*</label>
          <FormInput
            field="category"
            value={values.category}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("category")}
            required
          />
          <FormErrorMessage error={errors["category"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Proficiency Level* (1-5)
          </label>
          <FormInput
            field="proficiencyLevel"
            value={values.proficiencyLevel}
            type="number"
            min={1}
            max={5}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("proficiencyLevel")}
            required
          />
          <FormErrorMessage error={errors["proficiencyLevel"]} />
        </div>

        <CancelBtn resetForm={handleCancel} />
        <SaveBtn isSubmitting={isSubmitting} component="Skill" />
      </form>
    </div>
  );
}
