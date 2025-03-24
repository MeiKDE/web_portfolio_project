// Add new certification functions

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

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
