import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React, { JSX } from "react";
import { Certification } from "../Interface";

interface CertificationListProps {
  certification: Certification;
  isEditing: boolean;
  onChangeHandler: (id: string, field: string, value: any) => void;
  onClickHandler: (id: string) => void;
  getCurrentDate: () => string;
}

export default function CertificationList({
  certification,
  isEditing,
  onChangeHandler,
  onClickHandler,
  getCurrentDate,
}: CertificationListProps) {
  return (
    <div
      key={certification.id}
      className="relative border-b pb-4 last:border-0"
    >
      <div className="flex items-center gap-3">
        <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0">
          <CheckCircle className="h-4 w-4" />
        </Badge>
        <div className="flex-grow">
          {isEditing ? (
            // Show input fields when editing
            <>
              <Input
                type="text"
                value={certification.name}
                onChange={(e) =>
                  onChangeHandler(certification.id, "issueDate", e.target.value)
                }
                className="font-medium mb-2 w-full"
                placeholder="Certification Name"
              />
              <Input
                type="text"
                value={certification.issuer}
                onChange={(e) =>
                  onChangeHandler(certification.id, "issueDate", e.target.value)
                }
                className="text-sm text-muted-foreground mb-2 w-full"
                placeholder="Issuing Organization"
              />
              <div className="flex gap-2 mb-2">
                <div className="w-1/2">
                  <label className="text-xs text-muted-foreground">
                    Issue Date
                  </label>
                  <Input
                    type="date"
                    value={certification.issueDate}
                    onChange={(e) =>
                      onChangeHandler(
                        certification.id,
                        "issueDate",
                        e.target.value
                      )
                    }
                    className="text-sm text-muted-foreground"
                    max={getCurrentDate()}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-xs text-muted-foreground">
                    Expiration Date
                  </label>
                  <Input
                    type="date"
                    value={certification.expirationDate || ""}
                    onChange={(e) =>
                      onChangeHandler(
                        certification.id,
                        "issueDate",
                        e.target.value
                      )
                    }
                    className="text-sm text-muted-foreground"
                    max={getCurrentDate()}
                  />
                </div>
              </div>
              <Input
                type="url"
                value={certification.credentialUrl || ""}
                onChange={(e) =>
                  onChangeHandler(certification.id, "issueDate", e.target.value)
                }
                className="text-sm text-muted-foreground mb-2 w-full"
                placeholder="Credential URL"
              />
            </>
          ) : (
            // Show plain text when not editing
            <>
              <h4 className="font-medium">{certification.name}</h4>
              <p className="text-sm text-muted-foreground">
                {certification.issuer}
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span>Issued: {certification.issueDate}</span>
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
            </>
          )}
        </div>

        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 text-red-500"
            onClick={() => onClickHandler(certification.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
