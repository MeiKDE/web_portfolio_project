"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentGeneratorDialog } from "@/app/job-applications/components/DocumentGeneratorDialog";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/app/hooks/ui/useToast";
import { useMobile } from "@/app/hooks/ui/useMobile";
import { getUserProfile } from "@/app/lib/services/user-service";

interface JobListingsProps {
  jobListings: any[];
  updateJobStatus: (jobId: string, status: string) => void;
  userData: any;
  updateJobDocuments?: (jobId: string, documents: any) => void;
}

export function JobListings({
  jobListings,
  updateJobStatus,
  userData,
  updateJobDocuments,
}: JobListingsProps) {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<
    "resume" | "coverLetter"
  >("resume");
  // Update the document viewing dialog to include editing capabilities

  // First, add a new state for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState<any>(null);

  const statusColors: Record<string, string> = {
    saved: "bg-gray-100 text-gray-800",
    applied: "bg-blue-100 text-blue-800",
    "phone-screening": "bg-purple-100 text-purple-800",
    interview: "bg-amber-100 text-amber-800",
    "offer-received": "bg-emerald-100 text-emerald-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    saved: "Saved",
    applied: "Applied",
    "phone-screening": "Phone Screening",
    interview: "Interview",
    "offer-received": "Offer Received",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  const handleGenerateDocuments = (job: any) => {
    setSelectedJob(job);
    setIsGeneratorOpen(true);
  };

  // Update the handleViewDocuments function to initialize the document for editing
  const handleViewDocuments = (
    job: any,
    documentType: "resume" | "coverLetter"
  ) => {
    setSelectedJob(job);
    setActiveDocument(documentType);
    setIsDocumentViewOpen(true);
    setIsEditing(false);
    setEditedDocument(null);
  };

  // Add a function to handle starting the edit mode
  const handleEditDocument = () => {
    if (selectedJob && activeDocument) {
      setIsEditing(true);
      setEditedDocument(
        JSON.parse(JSON.stringify(selectedJob.documents[activeDocument]))
      );
    }
  };

  // Add a function to save the edited document
  const handleSaveEditedDocument = () => {
    if (selectedJob && activeDocument && editedDocument && updateJobDocuments) {
      const updatedDocuments = {
        ...selectedJob.documents,
        [activeDocument]: editedDocument,
      };
      updateJobDocuments(selectedJob.id, updatedDocuments);
      setIsEditing(false);
      alert("Document updated successfully!");
    }
  };

  return (
    <div>
      {jobListings.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No job listings yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first job listing to get started
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobListings.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[job.status]}>
                      {statusLabels[job.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(job.dateAdded), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {job.documents?.resume && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleViewDocuments(job, "resume")
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-600"
                                >
                                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                  <polyline points="14 2 14 8 20 8" />
                                  <line x1="16" x2="8" y1="13" y2="13" />
                                  <line x1="16" x2="8" y1="17" y2="17" />
                                  <line x1="10" x2="8" y1="9" y2="9" />
                                </svg>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Resume</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {job.documents?.coverLetter && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleViewDocuments(job, "coverLetter")
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-purple-600"
                                >
                                  <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                                  <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                                  <path d="M4 12h16" />
                                  <path d="M9 12v4" />
                                  <path d="M15 12v4" />
                                  <path d="M9 4v4" />
                                  <path d="M15 4v4" />
                                </svg>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Cover Letter</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        onClick={() => handleGenerateDocuments(job)}
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" x2="8" y1="13" y2="13" />
                          <line x1="16" x2="8" y1="17" y2="17" />
                          <line x1="10" x2="8" y1="9" y2="9" />
                        </svg>
                        Generate
                      </Button>
                      {job.status === "saved" && (
                        <Button
                          onClick={() => updateJobStatus(job.id, "applied")}
                          size="sm"
                          className="h-8"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                          </svg>
                          Apply
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DocumentGeneratorDialog
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        job={selectedJob}
        userData={userData}
        onSaveDocuments={(documents) => {
          if (selectedJob && updateJobDocuments) {
            updateJobDocuments(selectedJob.id, documents);
          }
        }}
      />

      {/* Document View/Edit Dialog */}
      {selectedJob && (
        <Dialog open={isDocumentViewOpen} onOpenChange={setIsDocumentViewOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {activeDocument === "resume" ? "Resume" : "Cover Letter"} for{" "}
                {selectedJob.title} at {selectedJob.company}
                {isEditing && " (Editing)"}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              {activeDocument === "resume" &&
                selectedJob.documents?.resume &&
                (isEditing ? (
                  <div className="space-y-4">
                    {/* Summary Editor */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Professional Summary
                      </h3>
                      <textarea
                        className="w-full p-3 border rounded-md min-h-[100px]"
                        value={editedDocument.summary}
                        onChange={(e) =>
                          setEditedDocument({
                            ...editedDocument,
                            summary: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Experience Editor */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Experience Highlights
                      </h3>
                      {editedDocument.experience.map(
                        (exp: any, expIndex: number) => (
                          <div
                            key={expIndex}
                            className="mb-4 p-3 border rounded-md"
                          >
                            <p className="font-medium">
                              {exp.company} - {exp.title}
                            </p>
                            {exp.highlights.map(
                              (highlight: string, hIndex: number) => (
                                <div key={hIndex} className="mt-2">
                                  <textarea
                                    className="w-full p-2 border rounded-md"
                                    value={highlight}
                                    onChange={(e) => {
                                      const newExp = [
                                        ...editedDocument.experience,
                                      ];
                                      newExp[expIndex].highlights[hIndex] =
                                        e.target.value;
                                      setEditedDocument({
                                        ...editedDocument,
                                        experience: newExp,
                                      });
                                    }}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )
                      )}
                    </div>

                    {/* Skills Editor */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Skills (comma separated)
                      </h3>
                      <textarea
                        className="w-full p-3 border rounded-md"
                        value={editedDocument.skills.join(", ")}
                        onChange={(e) => {
                          const skills = e.target.value
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter((skill) => skill);
                          setEditedDocument({ ...editedDocument, skills });
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Card className="border border-gray-200">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center border-b pb-4">
                          <h1 className="text-2xl font-bold">
                            {selectedJob.documents.resume.name}
                          </h1>
                          <p className="text-gray-600">
                            {selectedJob.documents.resume.title}
                          </p>
                          <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
                            <span>
                              {selectedJob.documents.resume.contact.email}
                            </span>
                            <span>
                              {selectedJob.documents.resume.contact.phone}
                            </span>
                            <span>
                              {selectedJob.documents.resume.contact.location}
                            </span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                            Professional Summary
                          </h2>
                          <p className="text-sm">
                            {selectedJob.documents.resume.summary}
                          </p>
                        </div>

                        {/* Experience */}
                        <div>
                          <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                            Work Experience
                          </h2>
                          <div className="space-y-4">
                            {selectedJob.documents.resume.experience.map(
                              (exp: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-baseline">
                                    <h3 className="font-medium">
                                      {exp.company}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                      {exp.years}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium">
                                    {exp.title}
                                  </p>
                                  <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                                    {exp.highlights.map(
                                      (highlight: string, i: number) => (
                                        <li key={i}>{highlight}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                            Skills
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.documents.resume.skills.map(
                              (skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-sm rounded-md"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        {/* Education */}
                        <div>
                          <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                            Education
                          </h2>
                          <div className="space-y-2">
                            {selectedJob.documents.resume.education.map(
                              (edu: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-baseline">
                                    <h3 className="font-medium">
                                      {edu.institution}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                      {edu.year}
                                    </span>
                                  </div>
                                  <p className="text-sm">{edu.degree}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Certifications */}
                        <div>
                          <h2 className="text-lg font-semibold border-b pb-1 mb-2">
                            Certifications
                          </h2>
                          <ul className="list-disc pl-5 text-sm">
                            {selectedJob.documents.resume.certifications.map(
                              (cert: string, index: number) => (
                                <li key={index}>{cert}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {activeDocument === "coverLetter" &&
                selectedJob.documents?.coverLetter &&
                (isEditing ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-2">
                      Cover Letter Content
                    </h3>
                    <textarea
                      className="w-full p-3 border rounded-md min-h-[400px]"
                      value={editedDocument.content}
                      onChange={(e) =>
                        setEditedDocument({
                          ...editedDocument,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <Card className="border border-gray-200">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {/* Letterhead */}
                        <div className="text-center border-b pb-4">
                          <h1 className="text-2xl font-bold">
                            {selectedJob.documents.coverLetter.letterhead.name}
                          </h1>
                          <p className="text-gray-600">
                            {selectedJob.documents.coverLetter.letterhead.title}
                          </p>
                          <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
                            <span>
                              {
                                selectedJob.documents.coverLetter.letterhead
                                  .contact.email
                              }
                            </span>
                            <span>
                              {
                                selectedJob.documents.coverLetter.letterhead
                                  .contact.phone
                              }
                            </span>
                            <span>
                              {
                                selectedJob.documents.coverLetter.letterhead
                                  .contact.location
                              }
                            </span>
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <p>
                            {new Date().toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                        {/* Content */}
                        <div className="whitespace-pre-line text-sm">
                          {selectedJob.documents.coverLetter.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (isEditing) {
                      if (confirm("Discard changes?")) {
                        setIsEditing(false);
                        setEditedDocument(null);
                      }
                    } else {
                      setIsDocumentViewOpen(false);
                    }
                  }}
                >
                  {isEditing ? "Cancel" : "Close"}
                </Button>

                {isEditing ? (
                  <Button onClick={handleSaveEditedDocument}>
                    Save Changes
                  </Button>
                ) : (
                  <Button onClick={handleEditDocument}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1.5"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                    Edit Document
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
