import { Input } from "@/components/ui/input";
import { CancelSaveButtons } from "./CancelSaveButtons";
import { FieldValidation } from "./Field_Validation";
import { Skill } from "../Interface";

interface NewSkillProps {
  userId: string;
  values: Record<string, any>;
  formErrors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (field: string, value: any) => void;
  touchField: (field: string) => void;
  getInputClassName: (id: string, field: string, baseClass: string) => string;
  handleNewSkillChange: (
    field: string,
    value: any,
    setNewItemData: any,
    handleChange: any,
    values: any
  ) => void;
  handleCancelAdd: (cancelAddingNew: () => void, resetForm: () => void) => void;
  handleSaveNewSkill: (
    e: React.FormEvent,
    validateForm: () => boolean,
    values: any,
    touchField: (field: string) => void,
    setNewItemData: any,
    userId: string,
    mutate: () => Promise<any>,
    resetForm: () => void,
    cancelAddingNew: () => void
  ) => Promise<void>;
  setNewItemData: (data: any) => void;
  mutate: () => Promise<any>;
  resetForm: () => void;
  cancelAddingNew: () => void;
  validateForm: () => boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setSaveSuccess: (success: boolean) => void;
  setIsAddingNew: (isAddingNew: boolean) => void;
  touchedFields: Record<string, boolean>;
}

export function NewSkill({
  userId,
  values,
  formErrors,
  isSubmitting,
  handleChange,
  touchField,
  getInputClassName,
  handleNewSkillChange,
  handleCancelAdd,
  handleSaveNewSkill,
  setNewItemData,
  mutate,
  resetForm,
  cancelAddingNew,
  validateForm,
  setIsSubmitting,
  setSaveSuccess,
  setIsAddingNew,
  touchedFields,
}: NewSkillProps) {
  const skillToValidate: Skill = {
    id: "",
    name: values.name,
    category: values.category,
    proficiencyLevel: values.proficiencyLevel,
  };

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Skill</h4>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          touchField("name");
          touchField("category");
          touchField("proficiencyLevel");

          if (!validateForm()) {
            return;
          }

          setIsSubmitting(true);
          try {
            await handleSaveNewSkill(
              e,
              validateForm,
              values,
              touchField,
              setNewItemData,
              userId,
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
        }}
        className="space-y-4"
      >
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Skill Name*</label>
          <Input
            type="text"
            value={values.name}
            onChange={(e) =>
              handleNewSkillChange(
                "name",
                e.target.value,
                setNewItemData,
                handleChange,
                values
              )
            }
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
            onChange={(e) =>
              handleNewSkillChange(
                "category",
                e.target.value,
                setNewItemData,
                handleChange,
                values
              )
            }
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
            onChange={(e) =>
              handleNewSkillChange(
                "proficiencyLevel",
                parseInt(e.target.value),
                setNewItemData,
                handleChange,
                values
              )
            }
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

        <FieldValidation
          skill={skillToValidate}
          touchedFields={touchedFields}
        />

        <CancelSaveButtons
          cancelAddingNew={cancelAddingNew}
          isSubmitting={isSubmitting}
          handleCancelAdd={handleCancelAdd}
          resetForm={resetForm}
        />
      </form>
    </div>
  );
}
