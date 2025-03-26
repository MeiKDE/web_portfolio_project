import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React, { JSX } from "react";
import { Certification } from "../Interface";
import { useState } from "react";

export function CertificationList({
  editedData,
  isEditing,
  handleCertificationInputChange,
  handleDeleteCertification,
  handleDeleteItem,
  mutate,
  getCurrentDate,
}: {
  editedData: Certification[];
  isEditing: boolean;
  handleCertificationInputChange: (
    id: string,
    field: string,
    value: any,
    handleInputChange: (field: string, value: any) => void,
    touchField: (field: string) => void
  ) => void;
  handleDeleteCertification: (
    id: string,
    handleDeleteItem: (options: any) => Promise<void>,
    mutate: () => void
  ) => void;
  handleDeleteItem: (options: {
    id: string;
    endpoint: string;
    filterFn?: (item: any) => boolean;
    confirmMessage?: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }) => Promise<void>;
  mutate: () => Promise<any>;
  getCurrentDate: () => string;
}) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Add dummy implementations for these functions
  const handleInputChange = (field: string, value: any) => {
    console.log(`Change ${field} to ${value}`);
  };

  const touchField = (field: string) => {
    console.log(`Touched field: ${field}`);
  };

  const onDeleteClick = async (certificationId: string) => {
    try {
      console.log("Initiating delete for certification:", certificationId);
      setIsDeleting(certificationId);
      await handleDeleteCertification(
        certificationId,
        handleDeleteItem,
        mutate
      );
    } catch (error) {
      console.error("Error in onDeleteClick:", error);
      alert("Failed to delete certification. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {editedData.map((certification: Certification) => (
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
                <>
                  <Input
                    type="text"
                    value={certification.name}
                    onChange={(e) =>
                      handleCertificationInputChange(
                        certification.id,
                        "name",
                        e.target.value,
                        handleInputChange,
                        touchField
                      )
                    }
                    className={`font-medium mb-2 w-full ${
                      !certification.name ? "border-red-500" : ""
                    }`}
                    placeholder="Certification Name *"
                    required
                  />
                  <Input
                    type="text"
                    value={certification.issuer}
                    onChange={(e) =>
                      handleCertificationInputChange(
                        certification.id,
                        "issuer",
                        e.target.value,
                        handleInputChange,
                        touchField
                      )
                    }
                    className={`text-sm mb-2 w-full ${
                      !certification.issuer ? "border-red-500" : ""
                    }`}
                    placeholder="Issuing Organization *"
                    required
                  />
                  <div className="flex gap-2 mb-2">
                    <div className="w-1/2">
                      <label className="text-xs text-muted-foreground">
                        Issue Date *
                      </label>
                      <Input
                        type="date"
                        value={certification.issueDate}
                        onChange={(e) =>
                          handleCertificationInputChange(
                            certification.id,
                            "issueDate",
                            e.target.value,
                            handleInputChange,
                            touchField
                          )
                        }
                        className={`text-sm ${
                          !certification.issueDate ? "border-red-500" : ""
                        }`}
                        max={getCurrentDate()}
                        required
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
                          handleCertificationInputChange(
                            certification.id,
                            "expirationDate",
                            e.target.value,
                            handleInputChange,
                            touchField
                          )
                        }
                        className="text-sm"
                        max={getCurrentDate()}
                      />
                    </div>
                  </div>
                  <Input
                    type="url"
                    value={certification.credentialUrl || ""}
                    onChange={(e) =>
                      handleCertificationInputChange(
                        certification.id,
                        "credentialUrl",
                        e.target.value,
                        handleInputChange,
                        touchField
                      )
                    }
                    className="text-sm w-full"
                    placeholder="Credential URL"
                  />
                </>
              ) : (
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
                onClick={() => onDeleteClick(certification.id)}
                className="text-red-500"
                disabled={isDeleting === certification.id}
              >
                {isDeleting === certification.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
