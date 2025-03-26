// This function is used to SAVE a new certification
// Creating New certifications
// Called when saving the Add New Certification form
import React from "react";

export const handleSaveNewCertification = (
  e: React.FormEvent,
  handleSaveNewItem: (options: any) => void,
  formatDateForDatabase: (date: string) => string,
  mutate: () => void
) => {
  handleSaveNewItem({
    event: e,
    requiredFields: ["name", "issuer", "issueDate"],
    formatData: (data: any) => ({
      name: data?.name?.trim(),
      issuer: data?.issuer?.trim(),
      issueDate: data?.issueDate
        ? formatDateForDatabase(data.issueDate as string)
        : "",
      expirationDate:
        data?.expirationDate && (data.expirationDate as string).trim() !== ""
          ? formatDateForDatabase(data.expirationDate as string)
          : null,
      credentialUrl:
        data?.credentialUrl && (data.credentialUrl as string).trim() !== ""
          ? (data.credentialUrl as string).trim()
          : null,
    }),
    endpoint: "/api/certifications/",
    onSuccess: () => mutate(), // Refresh data on success
    onError: (error: any) =>
      console.error("Error adding certification:", error),
  });
};
