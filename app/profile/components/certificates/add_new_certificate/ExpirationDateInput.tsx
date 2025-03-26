import { Certification } from "../Interface";
import { Input } from "@/components/ui/input";

interface ExpirationDateInputProps {
  formData: Partial<Certification>;
  errors: Record<string, string>;
  handleInputChange: (field: keyof Certification, value: string) => void;
}

export function ExpirationDateInput({
  formData,
  errors,
  handleInputChange,
}: ExpirationDateInputProps) {
  return (
    <div className="flex-1">
      <label className="block text-sm text-gray-600 mb-1">
        Expiration Date
      </label>
      <Input
        type="date"
        value={formData.expirationDate || ""}
        onChange={(e) => handleInputChange("expirationDate", e.target.value)}
        min={formData.issueDate}
      />
    </div>
  );
}
