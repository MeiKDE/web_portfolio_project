"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "@/app/job-applications/components/ResumePreview";
import { CoverLetterPreview } from "@/app/job-applications/components/CoverLetterPreview";
import { DocumentSettings } from "@/app/job-applications/components/DocumentSettings";
import React from "react";

interface DocumentGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  userData: any;
  onSaveDocuments?: (documents: any) => void;
}

export function DocumentGeneratorDialog({
  isOpen,
  onClose,
  job,
  userData,
  onSaveDocuments,
}: DocumentGeneratorDialogProps) {
  const [activeTab, setActiveTab] = useState("resume");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [coverLetterData, setCoverLetterData] = useState<any>(null);
  const [settings, setSettings] = useState({
    tone: "professional",
    focusAreas: ["technical-skills", "experience", "education"],
    includePersonalProjects: true,
    highlightKeywords: true,
  });

  // Add a state to track if we're loading existing documents
  const [isLoadingExistingDocuments, setIsLoadingExistingDocuments] =
    useState(false);

  // Add this useEffect after the existing state declarations
  React.useEffect(() => {
    if (isOpen && job && job.documents) {
      setIsLoadingExistingDocuments(true);

      // Load existing resume if available
      if (job.documents.resume) {
        setResumeData(job.documents.resume);
      }

      // Load existing cover letter if available
      if (job.documents.coverLetter) {
        setCoverLetterData(job.documents.coverLetter);
      }

      setIsLoadingExistingDocuments(false);
    } else if (isOpen) {
      // Reset data when opening for a job without documents
      setResumeData(null);
      setCoverLetterData(null);
    }
  }, [isOpen, job]);

  const generateDocuments = async () => {
    if (isLoadingExistingDocuments) return;
    if (!job) return;

    setIsGenerating(true);

    try {
      // Simulate API call for resume generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate resume data based on job and user profile
      const generatedResumeData = {
        name: userData.name,
        title: userData.position,
        contact: {
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
        },
        summary: `Experienced ${
          userData.position
        } with ${calculateYearsOfExperience(
          userData.experience
        )} years of expertise in ${userData.skills
          .slice(0, 3)
          .join(", ")}. Proven track record of delivering results in ${
          job.industry || "the industry"
        }. Seeking to leverage my skills in ${job.title} role at ${
          job.company
        }.`,
        experience: userData.experience.map((exp: any) => ({
          ...exp,
          highlights: [
            `Led projects resulting in ${
              Math.floor(Math.random() * 30) + 10
            }% improvement in efficiency`,
            `Collaborated with cross-functional teams to deliver solutions for ${
              job.industry || "business"
            } challenges`,
            `Utilized ${userData.skills
              .slice(0, 3)
              .join(", ")} to optimize processes and workflows`,
          ],
        })),
        skills: userData.skills,
        education: [
          {
            degree: "Bachelor of Science in Data Science",
            institution: "University of Technology",
            year: "2016",
          },
        ],
        certifications: [
          "Certified Data Analyst (CDA)",
          "Advanced SQL Certification",
        ],
      };

      setResumeData(generatedResumeData);

      // Generate cover letter data
      const coverLetter = `Dear Hiring Manager,

I am writing to express my interest in the ${job.title} position at ${
        job.company
      }. With ${calculateYearsOfExperience(
        userData.experience
      )} years of experience as a ${
        userData.position
      }, I have developed a strong foundation in ${userData.skills
        .slice(0, 3)
        .join(", ")}.

Throughout my career at ${
        userData.experience[0]?.company
      }, I have consistently demonstrated my ability to ${
        settings.tone === "professional"
          ? "deliver high-quality results"
          : "think outside the box and drive innovation"
      }. My experience aligns perfectly with the requirements outlined in your job description, particularly in the areas of ${
        job.keySkills || "data analysis and visualization"
      }.

${
  settings.tone === "professional"
    ? "I am particularly drawn to " +
      job.company +
      " because of your reputation for excellence and innovation in the " +
      (job.industry || "technology") +
      " sector."
    : "I'm excited about the possibility of bringing my unique perspective and creative problem-solving skills to " +
      job.company +
      "!"
}

I look forward to the opportunity to discuss how my background, skills, and enthusiasm make me a strong candidate for this role. Thank you for considering my application.

Sincerely,
${userData.name}`;

      setCoverLetterData({
        content: coverLetter,
        letterhead: {
          name: userData.name,
          title: userData.position,
          contact: {
            email: userData.email,
            phone: userData.phone,
            location: userData.location,
          },
        },
      });
    } catch (error) {
      console.error("Error generating documents:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateYearsOfExperience = (experience: any[]) => {
    if (!experience || experience.length === 0) return 0;

    let totalYears = 0;
    experience.forEach((exp: any) => {
      const years = exp.years.split("-");
      const startYear = Number.parseInt(years[0]);
      const endYear =
        years[1] === "Present"
          ? new Date().getFullYear()
          : Number.parseInt(years[1]);
      totalYears += endYear - startYear;
    });

    return totalYears;
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    alert("Document download functionality would be implemented here");
    onClose();
  };

  const handleSaveDocuments = () => {
    if (onSaveDocuments && (resumeData || coverLetterData)) {
      const documents = {
        resume: resumeData,
        coverLetter: coverLetterData,
      };
      onSaveDocuments(documents);
      alert("Documents saved successfully!");
      onClose();
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {job.documents ? "Edit" : "Generate"} Application Documents
          </DialogTitle>
          <DialogDescription>
            {job.documents
              ? `Edit your tailored resume and cover letter for ${job.title} at ${job.company}`
              : `Create tailored resume and cover letter for ${job.title} at ${job.company}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-1">
            <DocumentSettings
              settings={settings}
              setSettings={setSettings}
              onGenerate={generateDocuments}
              isGenerating={isGenerating}
              job={job}
            />
          </div>

          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="coverLetter">Cover Letter</TabsTrigger>
              </TabsList>

              <TabsContent value="resume">
                <ResumePreview
                  resumeData={resumeData}
                  isGenerating={isGenerating}
                />
              </TabsContent>

              <TabsContent value="coverLetter">
                <CoverLetterPreview
                  coverLetterData={coverLetterData}
                  isGenerating={isGenerating}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {(resumeData || coverLetterData) && (
            <>
              <Button variant="secondary" onClick={handleSaveDocuments}>
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
                  className="lucide lucide-save mr-1.5"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Documents
              </Button>
              <Button onClick={handleDownload}>
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
                  className="lucide lucide-download mr-1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download Documents
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
