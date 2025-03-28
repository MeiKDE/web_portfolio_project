import { Certification } from "../Interface";
import { Input } from "@/components/ui/input";
import { getCurrentDate } from "@/app/hooks/date-utils";

interface IssueDateInputProps {
  formData: Partial<Certification>;
  errors: Record<string, string>;
  handleInputChange: (field: keyof Certification, value: string) => void;
}

export function IssueDateInput({
  formData,
  errors,
  handleInputChange,
}: IssueDateInputProps) {
  return (
    <div className="flex-1">
      <label className="block text-sm text-gray-600 mb-1">Issue Date*</label>
      <Input
        type="date"
        value={formData.issueDate || ""}
        onChange={(e) => handleInputChange("issueDate", e.target.value)}
        max={getCurrentDate()}
        className={errors.issueDate ? "border-red-500" : ""}
      />
      {errors.issueDate && (
        <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>
      )}
    </div>
  );
}
