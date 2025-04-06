import { Input } from "@/components/ui/input";
import { Certification } from "@/app/components/Certifications/certifications.types";
import React from "react";

interface IssuingOrganizationInputProps {
  values: Certification;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  errors: any;
  touched: any;
}

export function IssuerInput({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
}: IssuingOrganizationInputProps) {
  return (
    <div>
      <Input
        type="text"
        value={values.issuer || ""}
        onChange={(e) => handleChange("issuer", e.target.value)}
        onBlur={() => handleBlur("issuer")}
        placeholder="Issuing Organization*"
        className={errors.issuer ? "border-red-500" : ""}
      />
    </div>
  );
}
