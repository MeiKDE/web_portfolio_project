// // Filename should be ValidateCertifications.ts (not .tsx)
// // Validate certifications before saving
// export const validateCertifications = (certifications: any[] | null) => {
//   const errors: Record<string, { field: string; message: string }[]> = {};

//   if (!certifications) return null;

//   for (const cert of certifications) {
//     const certErrors: { field: string; message: string }[] = [];

//     if (!cert.name.trim()) {
//       certErrors.push({ field: "name", message: "Name is required" });
//     }

//     if (!cert.issuer.trim()) {
//       certErrors.push({ field: "issuer", message: "Issuer is required" });
//     }

//     // Add other validations as needed

//     if (certErrors.length > 0) {
//       errors[cert.id] = certErrors;
//     }
//   }

//   return Object.keys(errors).length === 0 ? null : errors;
// };
