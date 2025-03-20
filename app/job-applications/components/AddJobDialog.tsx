"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: any) => void;
}

export function AddJobDialog({ isOpen, onClose, onAddJob }: AddJobDialogProps) {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    industry: "",
    description: "",
    keySkills: "",
    deadline: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Process key skills into an array
    const keySkills = jobData.keySkills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    onAddJob({
      ...jobData,
      keySkills,
    });

    // Reset form and close dialog
    setJobData({
      title: "",
      company: "",
      location: "",
      industry: "",
      description: "",
      keySkills: "",
      deadline: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Data Analyst"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                placeholder="e.g., Acme Corporation"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={jobData.industry}
                  onChange={handleChange}
                  placeholder="e.g., Technology"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Paste the job description here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keySkills">Key Skills (comma separated)</Label>
              <Input
                id="keySkills"
                name="keySkills"
                value={jobData.keySkills}
                onChange={handleChange}
                placeholder="e.g., SQL, Python, Data Analysis"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline (optional)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={jobData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
