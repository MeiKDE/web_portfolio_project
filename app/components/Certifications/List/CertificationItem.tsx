import React from "react";

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export const CertificationItem = ({
  certification,
}: {
  certification: Certification;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{certification.name}</h4>
        <p className="text-sm text-muted-foreground">{certification.issuer}</p>
        <div className="flex mt-1 text-xs text-muted-foreground">
          <span>Issued: {certification.issueDate}</span>
          {certification.expiryDate && (
            <>
              <span className="mx-2">•</span>
              <span>Expires: {certification.expiryDate}</span>
            </>
          )}
          {certification.credentialId && (
            <>
              <span className="mx-2">•</span>
              <span>ID: {certification.credentialId}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
