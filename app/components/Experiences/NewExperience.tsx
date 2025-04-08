import { useState } from "react";
import { Experience } from "@/app/components/Experiences/experiences.types";
import React from "react";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { CancelBtn } from "@/app/components/ui/CancelBtn";
import { SaveBtn } from "@/app/components/ui/SaveBtn";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormErrorMessage } from "@/app/components/ui/FormErrorMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface NewExperienceProps {
  userId: string;
  onSaveNewExperience: (values: Experience) => void | Promise<void>;
}

export function NewExperience({
  userId,
  onSaveNewExperience,
}: NewExperienceProps) {
  const formValues = {
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    isCurrentPosition: false,
    description: "",
    location: "",
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useFormValidation(formValues, {
    companyName: (value) =>
      value.length > 0 ? null : "Company name is required",
    position: (value) => (value.length > 0 ? null : "Position is required"),
    startDate: (value) => (value.length > 0 ? null : "Start date is required"),
    endDate: (value, allValues) => {
      if (allValues?.isCurrentPosition) return null;
      if (!value) return "End date is required for past positions";
      if (allValues?.startDate && value < allValues.startDate)
        return "End date must be after start date";
      return null;
    },
    description: (value) =>
      value.length > 0 ? null : "Description is required",
    isCurrentPosition: () => null,
    location: () => null,
  });

  const getExperienceModel = (values: typeof formValues): Experience => {
    return {
      id: "",
      userId,
      companyName: values.companyName,
      position: values.position,
      startDate: values.startDate,
      endDate: values.isCurrentPosition ? undefined : values.endDate,
      isCurrentPosition: values.isCurrentPosition,
      description: values.description,
      location: values.location,
    };
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    await onSaveNewExperience(getExperienceModel(values));
    setIsSubmitting(false);
  };

  const getInputClassName = (field: string) => {
    return errors[field as keyof typeof errors] ? "border-red-500" : "";
  };

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Experience</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Company Name*</label>
          <FormInput
            field="companyName"
            value={values.companyName}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("companyName")}
            required
          />
          <FormErrorMessage error={errors["companyName"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Position*</label>
          <FormInput
            field="position"
            value={values.position}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("position")}
            required
          />
          <FormErrorMessage error={errors["position"]} />
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Location</label>
          <FormInput
            field="location"
            value={values.location}
            handleChange={(field, value) =>
              handleChange(field as keyof typeof values, value)
            }
            handleBlur={(field) => handleBlur(field as keyof typeof values)}
            errors={errors}
            touched={touched}
            className={getInputClassName("location")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <label className="text-sm text-muted-foreground">Start Date*</label>
            <FormInput
              field="startDate"
              type="date"
              value={values.startDate}
              handleChange={(field, value) =>
                handleChange(field as keyof typeof values, value)
              }
              handleBlur={(field) => handleBlur(field as keyof typeof values)}
              errors={errors}
              touched={touched}
              className={getInputClassName("startDate")}
              required
            />
            <FormErrorMessage error={errors["startDate"]} />
          </div>

          <div className="mb-2">
            <label className="text-sm text-muted-foreground">End Date</label>
            <FormInput
              field="endDate"
              type="date"
              value={values.endDate}
              handleChange={(field, value) =>
                handleChange(field as keyof typeof values, value)
              }
              handleBlur={(field) => handleBlur(field as keyof typeof values)}
              errors={errors}
              touched={touched}
              className={getInputClassName("endDate")}
              disabled={values.isCurrentPosition}
            />
            <FormErrorMessage error={errors["endDate"]} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isCurrentPosition"
            checked={values.isCurrentPosition}
            onCheckedChange={(checked) =>
              handleChange("isCurrentPosition", checked)
            }
          />
          <label
            htmlFor="isCurrentPosition"
            className="text-sm text-muted-foreground"
          >
            I currently work here
          </label>
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">Description*</label>
          <Textarea
            name="description"
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            className={getInputClassName("description")}
            rows={4}
          />
          <FormErrorMessage error={errors["description"]} />
        </div>

        <div className="flex gap-2">
          <CancelBtn resetForm={resetForm} />
          <SaveBtn isSubmitting={isSubmitting} component="Experience" />
        </div>
      </form>
    </div>
  );
}
