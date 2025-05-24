"use client";
import { Certification } from "../certifications.types";

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
          {certification.expirationDate && (
            <>
              <span className="mx-2">•</span>
              <span>Expires: {certification.expirationDate}</span>
            </>
          )}
          {certification.credentialUrl && (
            <>
              <span className="mx-2">•</span>
              <span>URL: {certification.credentialUrl}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
