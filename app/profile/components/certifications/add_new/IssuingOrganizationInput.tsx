import { Input } from "@/components/ui/input";
import { Certification } from "../Interface";

interface IssuingOrganizationInputProps {
  formData: Partial<Certification>;
  errors: Record<string, string>;
  handleInputChange: (field: keyof Certification, value: string) => void;
}

export function IssuingOrganizationInput({
  formData,
  errors,
  handleInputChange,
}: IssuingOrganizationInputProps) {
  return (
    <div>
      <Input
        type="text"
        value={formData.issuer || ""}
        onChange={(e) => handleInputChange("issuer", e.target.value)}
        placeholder="Issuing Organization*"
        className={errors.issuer ? "border-red-500" : ""}
      />
      {errors.issuer && (
        <p className="text-red-500 text-sm mt-1">{errors.issuer}</p>
      )}
    </div>
  );
}
