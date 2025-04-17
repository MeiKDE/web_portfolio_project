import { Experience } from "@/app/components/Experiences/experiences.types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteButton } from "@/app/components/ui/DeleteBtn";
import { useFormValidation } from "@/app/hooks/form/use-form-validation";
import { formatDateForInput } from "@/app/lib/utils/date-utils";
import * as React from "react";

interface ExperienceFormProps {
  experience: Experience;
  onDeleteClick: (id: string) => void;
  onFormChange: (
    id: string,
    field: string,
    value: string | boolean,
    isFormValid: boolean
  ) => void;
}

export const ExperienceForm = ({
  experience,
  onDeleteClick,
  onFormChange,
}: ExperienceFormProps) => {
  const initialValues = {
    companyName: experience.companyName || "",
    position: experience.position || "",
    startDate: experience.startDate
      ? formatDateForInput(experience.startDate)
      : "",
    endDate: experience.endDate ? formatDateForInput(experience.endDate) : "",
    isCurrentPosition: experience.isCurrentPosition || false,
    description: experience.description || "",
    location: experience.location || "",
  };

  const { values, errors, handleChange, validateForm } = useFormValidation(
    initialValues,
    {
      companyName: (value: string | undefined) =>
        value && value.length > 0 ? null : "Company name is required",
      position: (value: string | undefined) =>
        value && value.length > 0 ? null : "Position is required",
      startDate: (value: string | undefined) =>
        value && value.length > 0 ? null : "Start date is required",
      endDate: (
        value: string | undefined,
        allValues?: typeof initialValues
      ) => {
        if (allValues?.isCurrentPosition) return null;
        if (!value) return "End date is required for past positions";
        if (value < allValues?.startDate!)
          return "End date must be after start date";
        return null;
      },
      description: (value: string | undefined) =>
        value && value.length > 0 ? null : "Description is required",
      isCurrentPosition: () => null,
      location: () => null,
    }
  );

  const handleFieldChange = (
    field: keyof typeof values,
    value: string | boolean
  ) => {
    handleChange(field, value);
    const isValid = validateForm();
    onFormChange(experience.id, field, value.toString(), isValid);
  };

  const getInputClassName = (field: keyof typeof errors) => {
    return errors[field] ? "border-red-500" : "";
  };

  return (
    <div className="border rounded-md p-4 relative">
      <div className="absolute top-4 right-4">
        <DeleteButton onDeleteClick={() => onDeleteClick(experience.id)} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Company Name*</label>
          <Input
            type="text"
            value={values.companyName}
            onChange={(e) => handleFieldChange("companyName", e.target.value)}
            className={getInputClassName("companyName")}
          />
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Position*</label>
          <Input
            type="text"
            value={values.position}
            onChange={(e) => handleFieldChange("position", e.target.value)}
            className={getInputClassName("position")}
          />
          {errors.position && (
            <p className="text-red-500 text-xs mt-1">{errors.position}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Location</label>
          <Input
            type="text"
            value={values.location}
            onChange={(e) => handleFieldChange("location", e.target.value)}
            className={getInputClassName("location")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Start Date*</label>
            <Input
              type="date"
              value={values.startDate}
              onChange={(e) => handleFieldChange("startDate", e.target.value)}
              className={getInputClassName("startDate")}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-muted-foreground">End Date</label>
            <Input
              type="date"
              value={values.endDate}
              onChange={(e) => handleFieldChange("endDate", e.target.value)}
              className={getInputClassName("endDate")}
              disabled={values.isCurrentPosition}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`isCurrentPosition-${experience.id}`}
            checked={values.isCurrentPosition}
            onCheckedChange={(checked) =>
              handleFieldChange("isCurrentPosition", checked as boolean)
            }
          />
          <label
            htmlFor={`isCurrentPosition-${experience.id}`}
            className="text-sm text-muted-foreground"
          >
            I currently work here
          </label>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Description*</label>
          <Textarea
            value={values.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className={getInputClassName("description")}
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
