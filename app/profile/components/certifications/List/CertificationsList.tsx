import { Award } from "lucide-react";
import React, { JSX } from "react";

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export const CertificationsList = ({
  certification,
}: {
  certification: Certification;
}) => {
  return (
    <div>
      <h4 className="font-medium">{certification.name}</h4>
      <p className="text-sm text-muted-foreground">{certification.issuer}</p>
      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Award className="h-4 w-4 text-blue-500" />
          <span>Issued: {certification.issueDate}</span>
        </div>
        {certification.expirationDate && (
          <span>Expires: {certification.expirationDate}</span>
        )}
      </div>
      {certification.credentialUrl && (
        <a
          href={certification.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline mt-1 inline-block"
        >
          View Credential
        </a>
      )}
    </div>
  );
};
