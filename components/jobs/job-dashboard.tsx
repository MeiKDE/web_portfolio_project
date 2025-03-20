"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobListings } from "./job-listings"
import { JobPipeline } from "./job-pipeline"
import { JobAnalytics } from "./job-analytics"
import { AddJobDialog } from "./add-job-dialog"
import { Button } from "@/components/ui/button"

interface JobDashboardProps {
  userData: any
  initialJobListings: any[]
}

export function JobDashboard({ userData, initialJobListings }: JobDashboardProps) {
  const [jobListings, setJobListings] = useState(initialJobListings)
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false)

  const addJob = (newJob: any) => {
    setJobListings((prev) => [
      ...prev,
      {
        ...newJob,
        id: `job-${Date.now()}`,
        status: "saved",
        dateAdded: new Date().toISOString(),
        pipeline: [],
      },
    ])
  }

  const updateJobStatus = (jobId: string, status: string) => {
    setJobListings((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status,
              pipeline: [
                ...job.pipeline,
                {
                  stage: status,
                  date: new Date().toISOString(),
                  notes: "",
                },
              ],
            }
          : job,
      ),
    )
  }

  const addPipelineNote = (jobId: string, stage: string, note: string) => {
    setJobListings((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              pipeline: job.pipeline.map((p: any) => (p.stage === stage ? { ...p, notes: note } : p)),
            }
          : job,
      ),
    )
  }

  const updateJobDocuments = (jobId: string, documents: any) => {
    setJobListings((prev) => prev.map((job) => (job.id === jobId ? { ...job, documents } : job)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Welcome back, {userData.name}</h2>
          <p className="text-gray-500">Manage your job applications and generate tailored documents</p>
        </div>
        <Button onClick={() => setIsAddJobDialogOpen(true)} className="flex items-center gap-1.5">
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
            className="lucide lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add Job
        </Button>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="listings">Job Listings</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          <JobListings
            jobListings={jobListings}
            updateJobStatus={updateJobStatus}
            userData={userData}
            updateJobDocuments={updateJobDocuments}
          />
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
          <JobPipeline jobListings={jobListings} updateJobStatus={updateJobStatus} addPipelineNote={addPipelineNote} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <JobAnalytics jobListings={jobListings} />
        </TabsContent>
      </Tabs>

      <AddJobDialog isOpen={isAddJobDialogOpen} onClose={() => setIsAddJobDialogOpen(false)} onAddJob={addJob} />
    </div>
  )
}

