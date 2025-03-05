"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, CheckCircle } from "lucide-react";
import useSWR from 'swr';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

interface CertificationsProps {
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Certifications({ userId }: CertificationsProps) {
  const [editable, setEditable] = useState(false);
  const [certificationsData, setCertificationsData] = useState<Certification[]>([]);
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/${userId}/certifications`,
    fetcher
  );
  
  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setCertificationsData(data);
    }
  }, [data]);

  if (isLoading) return <div>Loading certifications...</div>;
  if (error) return <div>Error loading certification information</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Certifications</h3>
          <Button variant="ghost" size="sm" onClick={() => setEditable(!editable)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
        {certificationsData && certificationsData.length > 0 ? (
          <div className="space-y-4">
            {certificationsData.map((certification) => (
              <div key={certification.id} className="flex items-center gap-3">
                <Badge className="h-8 w-8 rounded-full flex items-center justify-center p-0">
                  <CheckCircle className="h-4 w-4" />
                </Badge>
                <div>
                  <h4 className="font-medium">{certification.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {certification.issuer} · Issued {new Date(certification.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">No certifications added yet</div>
        )}
      </CardContent>
    </Card>
  );
}
