import { Input } from "@/components/ui/input";
import { CancelSave } from "@/app/profile/components/ui/CancelSave";
import { useState } from "react";
import { SaveNewCertification } from "@/app/profile/components/Certifications/SaveNewCertifications";
import { FormValidation } from "@/app/profile/components/Certifications/NewCertification/FormValidation";
import React, { JSX } from "react";

interface NewCertificationProps {
  userId: string;
  onSave: () => void;
}

export function NewCertification({ userId, onSave }: NewCertificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [values, setValues] = useState<Record<string, any>>({
    name: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialUrl: "",
  });

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const getInputClassName = (id: string, field: string, baseClass: string) => {
    const hasError = touchedFields[field] && formErrors[field];
    return `${baseClass} ${hasError ? "border-red-500" : ""}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    let isValid = true;

    if (!values.name || values.name.trim() === "") {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!values.issuer || values.issuer.trim() === "") {
      errors.issuer = "Issuing organization is required";
      isValid = false;
    }

    if (!values.issueDate || values.issueDate.trim() === "") {
      errors.issueDate = "Issue date is required";
      isValid = false;
    }

    if (!values.expirationDate || values.expirationDate.trim() === "") {
      errors.expirationDate = "Expiration date is required";
      isValid = false;
    }

    if (!values.credentialUrl || values.credentialUrl.trim() === "") {
      errors.credentialUrl = "Credential URL is required";
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        id: "",
        name: values.name.trim(),
        issuer: values.issuer.trim(),
        issueDate: values.issueDate.trim(),
        expirationDate: values.expirationDate.trim(),
        credentialUrl: values.credentialUrl.trim(),
        userId,
      };
      await SaveNewCertification(postData);
      await onSave();
    } catch (error) {
      console.error("Error saving certification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 border p-4 rounded-md">
      <h4 className="font-medium mb-3">Add New Certification</h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Certification Name*
          </label>
          <Input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => setTouchedFields((prev) => ({ ...prev, name: true }))}
            className={getInputClassName("name", "name", "mt-1")}
            placeholder="e.g., AWS Solutions Architect"
          />
          {formErrors["name"] && (
            <p className="text-red-500 text-xs mt-1">{formErrors["name"]}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Issuing Organization*
          </label>
          <Input
            type="text"
            value={values.issuer}
            onChange={(e) => handleChange("issuer", e.target.value)}
            onBlur={() =>
              setTouchedFields((prev) => ({ ...prev, issuer: true }))
            }
            className={getInputClassName("issuer", "issuer", "mt-1")}
            placeholder="e.g., Amazon Web Services"
          />
          {formErrors["issuer"] && (
            <p className="text-red-500 text-xs mt-1">{formErrors["issuer"]}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-2">
            <label className="text-sm text-muted-foreground">Issue Date*</label>
            <Input
              type="date"
              value={values.issueDate}
              onChange={(e) => handleChange("issueDate", e.target.value)}
              onBlur={() =>
                setTouchedFields((prev) => ({ ...prev, issueDate: true }))
              }
              className={getInputClassName("issueDate", "issueDate", "mt-1")}
            />
            {formErrors["issueDate"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["issueDate"]}
              </p>
            )}
          </div>

          <div className="mb-2">
            <label className="text-sm text-muted-foreground">
              Expiration Date*
            </label>
            <Input
              type="date"
              value={values.expirationDate}
              onChange={(e) => handleChange("expirationDate", e.target.value)}
              onBlur={() =>
                setTouchedFields((prev) => ({ ...prev, expirationDate: true }))
              }
              className={getInputClassName(
                "expirationDate",
                "expirationDate",
                "mt-1"
              )}
            />
            {formErrors["expirationDate"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["expirationDate"]}
              </p>
            )}
          </div>
        </div>

        <div className="mb-2">
          <label className="text-sm text-muted-foreground">
            Credential URL*
          </label>
          <Input
            type="url"
            value={values.credentialUrl}
            onChange={(e) => handleChange("credentialUrl", e.target.value)}
            onBlur={() =>
              setTouchedFields((prev) => ({ ...prev, credentialUrl: true }))
            }
            className={getInputClassName(
              "credentialUrl",
              "credentialUrl",
              "mt-1"
            )}
            placeholder="e.g., https://www.credential.net/..."
          />
          {formErrors["credentialUrl"] && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors["credentialUrl"]}
            </p>
          )}
        </div>

        <FormValidation
          certification={{
            id: "",
            userId,
            name: values.name || "",
            issuer: values.issuer || "",
            issueDate: values.issueDate || "",
            expirationDate: values.expirationDate || "",
            credentialUrl: values.credentialUrl || "",
          }}
          touchedFields={touchedFields}
        />

        <CancelSave isSubmitting={isSubmitting} resetForm={onSave} />
      </form>
    </div>
  );
}
