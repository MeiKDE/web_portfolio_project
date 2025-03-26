import { Certification } from "../Interface";
import { Input } from "@/components/ui/input";

interface CredentialUrlInputProps {
  formData: Partial<Certification>;
  errors: Record<string, string>;
  handleInputChange: (field: keyof Certification, value: string) => void;
}
export function CredentialUrlInput({
  formData,
  errors,
  handleInputChange,
}: CredentialUrlInputProps) {
  return (
    <div>
      <Input
        type="url"
        value={formData.credentialUrl || ""}
        onChange={(e) => handleInputChange("credentialUrl", e.target.value)}
        placeholder="Credential URL (optional)"
      />
    </div>
  );
}
