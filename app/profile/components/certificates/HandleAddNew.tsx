import { Certification } from "./Interface";
// Add new certification functions

export const handleAddNew = (
  startAddingNew: (certifications: Certification[]) => void,
  setNewCertification: (certification: Omit<Certification, "id">) => void,
  getCurrentDate: () => string
) => {
  startAddingNew([
    {
      id: "new", // Temporary ID
      name: "",
      issuer: "",
      issueDate: getCurrentDate(),
      expirationDate: "",
      credentialUrl: "",
    },
  ]);

  setNewCertification({
    name: "",
    issuer: "",
    issueDate: getCurrentDate(),
    expirationDate: "",
    credentialUrl: "",
  });
};
