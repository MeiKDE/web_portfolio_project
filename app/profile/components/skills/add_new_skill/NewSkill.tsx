import { Input } from "@/components/ui/input";
import { CancelSaveButtons } from "./CancelSaveButtons";

interface NewSkillProps {
  userId: string;
  values: Record<string, any>;
  formErrors: Record<string, string>;
  newItemData: any;
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
}

export function NewSkill({
  userId,
  values,
  formErrors,
  newItemData,
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
}: NewSkillProps) {
  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Skill</h4>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!values.name || !values.category || !values.proficiencyLevel) {
            // Mark all fields as touched to show validation errors
            touchField("name");
            touchField("category");
            touchField("proficiencyLevel");
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
            value={newItemData?.name ?? ""}
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
            className={getInputClassName("new", "name", "mt-1")}
            placeholder="e.g., JavaScript, React, Agile"
          />
          {formErrors["new"] && (
            <p className="text-red-500 text-xs mt-1">{formErrors["new"]}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Category*</label>
          <Input
            type="text"
            value={newItemData?.category ?? ""}
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
            className={getInputClassName("new", "category", "mt-1")}
            placeholder="e.g., Frontend, Backend, DevOps"
          />
          {formErrors["new"] && (
            <p className="text-red-500 text-xs mt-1">{formErrors["new"]}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Proficiency Level* (1-5)
          </label>
          <Input
            type="number"
            min="1"
            max="5"
            value={newItemData?.proficiencyLevel ?? 3}
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
            className={getInputClassName("new", "proficiencyLevel", "mt-1")}
          />
          {formErrors["new"] && (
            <p className="text-red-500 text-xs mt-1">{formErrors["new"]}</p>
          )}
        </div>

        <CancelSaveButtons
          cancelAddingNew={cancelAddingNew}
          isSubmitting={isSubmitting}
          handleCancelAdd={handleCancelAdd}
          handleSaveNewSkill={handleSaveNewSkill}
          resetForm={resetForm}
          validateForm={validateForm}
          values={values}
          touchField={touchField}
          setNewItemData={setNewItemData}
          userId={userId}
          mutate={mutate}
        />
      </form>
    </div>
  );
}
