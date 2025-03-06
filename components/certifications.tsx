"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle, Save } from "lucide-react";
import useSWR from "swr";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

interface CertificationsProps {
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Utility function to format date to yyyy-MM-dd for input fields
const formatDateForInput = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Utility function to format date to ISO-8601 format for database
const formatDateForDatabase = (date: string) => {
  const d = new Date(date);
  return d.toISOString(); // Converts to ISO-8601 format
};

// Get current date in YYYY-MM-DD format for date input max attribute
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Certifications({ userId }: CertificationsProps) {
  const [editable, setEditable] = useState(false);
  const [certificationsData, setCertificationsData] = useState<Certification[]>(
    []
  );
  const [editedCertifications, setEditedCertifications] = useState<
    Certification[]
  >([]);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/certifications`,
    fetcher
  );

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setCertificationsData(data);
      setEditedCertifications(JSON.parse(JSON.stringify(data))); // Deep copy for editing
    }
  }, [data]);

  const handleEditToggle = () => {
    if (editable) {
      saveChanges();
    }
    setEditable(!editable);
  };

  const handleInputChange = (
    id: string,
    field: keyof Certification,
    value: string
  ) => {
    setEditedCertifications((prev) =>
      prev.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  const saveChanges = async () => {
    try {
      for (const certification of editedCertifications) {
        const payload = {
          name: certification.name,
          issuer: certification.issuer,
          issueDate: formatDateForDatabase(certification.issueDate), // Format for DB
          expirationDate: certification.expirationDate
            ? formatDateForDatabase(certification.expirationDate)
            : null, // Format for DB
          credentialUrl: certification.credentialUrl,
        };

        const response = await fetch(
          `/api/certifications/${certification.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to update certification: ${response.statusText}`
          );
        }
      }

      setCertificationsData(editedCertifications);
      mutate(); // Re-fetch data to ensure consistency
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  if (isLoading) return <div>Loading certifications...</div>;
  if (error) return <div>Error loading certification information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>
          {editable ? (
            <Button variant="ghost" size="sm" onClick={handleEditToggle}>
              <>
                <Save className="h-4 w-4 mr-2" />
                Done
              </>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleEditToggle}>
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </>
            </Button>
          )}
        </div>

        {certificationsData && certificationsData.length > 0 ? (
          <div className="space-y-4">
            {(editable ? editedCertifications : certificationsData).map(
              (certification) => (
                <div key={certification.id} className="flex items-center gap-3">
                  <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                    <CheckCircle className="h-4 w-4" />
                  </Badge>
                  <div>
                    {editable ? (
                      <>
                        <input
                          type="text"
                          value={certification.name}
                          onChange={(e) =>
                            handleInputChange(
                              certification.id,
                              "name",
                              e.target.value
                            )
                          }
                          className="font-medium mb-2"
                        />
                        <input
                          type="text"
                          value={certification.issuer}
                          onChange={(e) =>
                            handleInputChange(
                              certification.id,
                              "issuer",
                              e.target.value
                            )
                          }
                          className="text-sm text-muted-foreground mb-2"
                        />
                        <input
                          type="date"
                          value={formatDateForInput(certification.issueDate)}
                          onChange={(e) =>
                            handleInputChange(
                              certification.id,
                              "issueDate",
                              e.target.value
                            )
                          }
                          className="text-sm text-muted-foreground mb-2"
                          max={getCurrentDate()}
                        />
                        <input
                          type="date"
                          value={
                            certification.expirationDate
                              ? formatDateForInput(certification.expirationDate)
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              certification.id,
                              "expirationDate",
                              e.target.value
                            )
                          }
                          className="text-sm text-muted-foreground mb-2"
                          max={getCurrentDate()}
                        />
                        <input
                          type="url"
                          value={certification.credentialUrl || ""}
                          onChange={(e) =>
                            handleInputChange(
                              certification.id,
                              "credentialUrl",
                              e.target.value
                            )
                          }
                          className="text-sm text-muted-foreground mb-2"
                        />
                      </>
                    ) : (
                      <>
                        <h4 className="font-medium">{certification.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {certification.issuer} · Issued{" "}
                          {new Date(certification.issueDate).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </p>
                        {certification.expirationDate && (
                          <p className="text-sm text-muted-foreground">
                            Expires{" "}
                            {new Date(
                              certification.expirationDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                        {certification.credentialUrl && (
                          <a
                            href={certification.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500"
                          >
                            View Credential
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            No certifications added yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
