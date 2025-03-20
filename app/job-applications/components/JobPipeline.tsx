"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

interface JobPipelineProps {
  jobListings: any[];
  updateJobStatus: (jobId: string, status: string) => void;
  addPipelineNote: (jobId: string, stage: string, note: string) => void;
}

export function JobPipeline({
  jobListings,
  updateJobStatus,
  addPipelineNote,
}: JobPipelineProps) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [selectedStage, setSelectedStage] = useState("");

  const activeJobs = jobListings.filter(
    (job) =>
      job.status !== "saved" &&
      job.status !== "rejected" &&
      job.status !== "accepted"
  );

  const stages = [
    { id: "applied", label: "Applied", color: "bg-blue-100 text-blue-800" },
    {
      id: "phone-screening",
      label: "Phone Screening",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "interview",
      label: "Interview",
      color: "bg-amber-100 text-amber-800",
    },
    {
      id: "offer-received",
      label: "Offer Received",
      color: "bg-emerald-100 text-emerald-800",
    },
  ];

  const handleAddNote = () => {
    if (selectedJob && selectedStage && noteText.trim()) {
      addPipelineNote(selectedJob, selectedStage, noteText);
      setNoteText("");
    }
  };

  const getJobStage = (job: any) => {
    return stages.findIndex((stage) => stage.id === job.status);
  };

  const getNextStage = (currentStage: string) => {
    const currentIndex = stages.findIndex((stage) => stage.id === currentStage);
    return currentIndex < stages.length - 1
      ? stages[currentIndex + 1].id
      : null;
  };

  return (
    <div className="space-y-6">
      {activeJobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No active applications
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Apply to jobs to start tracking your progress
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {job.title} at {job.company}
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">
                    {job.status === "applied"
                      ? "Applied"
                      : job.status === "phone-screening"
                      ? "Phone Screening"
                      : job.status === "interview"
                      ? "Interview"
                      : job.status === "offer-received"
                      ? "Offer Received"
                      : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full mt-2 mb-4">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(getJobStage(job) + 1) * 25}%` }}
                  ></div>
                </div>

                {/* Pipeline Stages */}
                <div className="space-y-4">
                  {job.pipeline.map((stage: any, index: number) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              stage.stage === "applied"
                                ? "bg-blue-100 text-blue-800"
                                : stage.stage === "phone-screening"
                                ? "bg-purple-100 text-purple-800"
                                : stage.stage === "interview"
                                ? "bg-amber-100 text-amber-800"
                                : stage.stage === "offer-received"
                                ? "bg-emerald-100 text-emerald-800"
                                : ""
                            }
                          >
                            {stage.stage === "applied"
                              ? "Applied"
                              : stage.stage === "phone-screening"
                              ? "Phone Screening"
                              : stage.stage === "interview"
                              ? "Interview"
                              : stage.stage === "offer-received"
                              ? "Offer Received"
                              : ""}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(stage.date), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job.id);
                            setSelectedStage(stage.stage);
                            setNoteText(stage.notes || "");
                          }}
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
                            className="lucide lucide-pencil"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </Button>
                      </div>
                      {stage.notes && (
                        <div className="bg-gray-50 p-2 rounded text-sm">
                          {stage.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next Stage Button */}
                {getNextStage(job.status) && (
                  <Button
                    className="w-full mt-4"
                    onClick={() =>
                      updateJobStatus(
                        job.id,
                        getNextStage(job.status) as string
                      )
                    }
                  >
                    Move to{" "}
                    {getNextStage(job.status) === "phone-screening"
                      ? "Phone Screening"
                      : getNextStage(job.status) === "interview"
                      ? "Interview"
                      : getNextStage(job.status) === "offer-received"
                      ? "Offer Received"
                      : ""}
                  </Button>
                )}

                {/* Final Stage Buttons */}
                {job.status === "offer-received" && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => updateJobStatus(job.id, "rejected")}
                    >
                      Decline Offer
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => updateJobStatus(job.id, "accepted")}
                    >
                      Accept Offer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Note Editor */}
      {selectedJob && selectedStage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add notes about this stage (e.g., interview feedback, questions asked, etc.)"
              className="min-h-[100px]"
            />
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedJob(null);
                  setSelectedStage("");
                  setNoteText("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNote}>Save Notes</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
