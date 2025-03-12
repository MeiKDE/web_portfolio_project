"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Lightbulb,
  CheckCircle,
  X,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Plus,
  Briefcase,
  GraduationCap,
  Award,
  Star,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState({
    jobTitle: "",
    summary: "",
    experience: [{ company: "", position: "", duration: "", description: "" }],
    education: [{ school: "", degree: "", year: "" }],
    skills: [""],
  });
  const [aiSuggestions, setAiSuggestions] = useState({
    summary: "",
    experience: [""],
    skills: [""],
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Simulate AI processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setExtractedText(
          "Senior Full Stack Developer with 7+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture. Led development of SaaS platforms and e-commerce solutions."
        );
        // Simulate AI suggestions
        setAiSuggestions({
          summary:
            "Consider quantifying your achievements. For example: 'Increased application performance by 40% and reduced infrastructure costs by 25%.'",
          experience: [
            "Replace 'Led development' with a stronger action verb like 'Architected' or 'Spearheaded'",
          ],
          skills: [
            "Add 'Next.js' to your skills based on your experience with React",
          ],
        });
      }, 2000);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      [field]: value,
    });
  };

  // Handle experience field changes
  const handleExperienceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    });
  };

  // Add new experience entry
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { company: "", position: "", duration: "", description: "" },
      ],
    });
  };

  // Handle education field changes
  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    });
  };

  // Add new education entry
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { school: "", degree: "", year: "" },
      ],
    });
  };

  // Handle skills changes
  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = value;
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    });
  };

  // Add new skill
  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ""],
    });
  };

  // Accept AI suggestion for summary
  const acceptSummarySuggestion = () => {
    setResumeData({
      ...resumeData,
      summary:
        resumeData.summary +
        " Increased application performance by 40% and reduced infrastructure costs by 25%.",
    });
    // Clear the suggestion
    setAiSuggestions({
      ...aiSuggestions,
      summary: "",
    });
  };

  // Navigate to next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Simulate AI generating content based on job title
  const generateAiContent = () => {
    if (resumeData.jobTitle) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setResumeData({
          ...resumeData,
          summary: `Experienced ${resumeData.jobTitle} with a proven track record of delivering high-quality solutions. Skilled in modern technologies and methodologies.`,
          experience: [
            {
              company: "Example Corp",
              position: resumeData.jobTitle,
              duration: "2020 - Present",
              description:
                "Led key projects and initiatives, collaborating with cross-functional teams to deliver solutions on time and within budget.",
            },
          ],
          skills: [
            "JavaScript",
            "React",
            "Node.js",
            "Problem Solving",
            "Team Leadership",
          ],
        });
        // Set AI suggestions
        setAiSuggestions({
          summary:
            "Consider adding specific metrics or achievements to make your summary more impactful.",
          experience: [
            "Add specific projects or quantifiable achievements to your experience description.",
          ],
          skills: [
            "Consider adding more specific technical skills relevant to your role.",
          ],
        });
      }, 2000);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="create">Create from Scratch</TabsTrigger>
          </TabsList>

          {/* Upload Resume Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Upload Your Resume
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Upload your existing resume and our AI will extract the
                    information and suggest improvements.
                  </p>

                  <div className="border-2 border-dashed rounded-lg p-8 text-center mb-6">
                    <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="mb-2">Drag and drop your resume here</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF and DOCX formats
                    </p>
                    <div className="relative">
                      <Input
                        type="file"
                        accept=".pdf,.docx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" className="relative z-10">
                        <FileText className="h-4 w-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  </div>

                  {uploadedFile && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-medium">Uploaded File:</p>
                      <p className="text-sm">{uploadedFile.name}</p>
                      {isProcessing ? (
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing with AI...
                        </div>
                      ) : (
                        <div className="flex items-center mt-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Processing complete
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Suggestions & Preview */}
              <div className="space-y-6">
                {extractedText && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Extracted Content
                      </h2>
                      <div className="bg-muted p-4 rounded-lg mb-4">
                        <p>{extractedText}</p>
                      </div>

                      {/* AI Suggestions */}
                      {aiSuggestions.summary && (
                        <div className="p-3 bg-muted rounded-md border border-border">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-grow">
                              <p className="text-sm font-medium">
                                AI Suggestion:
                              </p>
                              <p className="text-sm">{aiSuggestions.summary}</p>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Regenerate
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Live Preview */}
                {extractedText && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Live Preview</h2>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      <div className="border rounded-lg p-6">
                        <h3 className="text-xl font-bold">Jane Doe</h3>
                        <p className="text-muted-foreground">
                          Senior Full Stack Developer
                        </p>
                        <Separator className="my-4" />
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Summary</h4>
                          <p className="text-sm">{extractedText}</p>
                        </div>
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="px-3 py-1">
                              React
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1">
                              Node.js
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1">
                              TypeScript
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1">
                              AWS
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Real-time feedback */}
                {resumeData.jobTitle && (
                  <div className="mt-4 p-3 bg-muted rounded-md border border-border">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">AI Feedback:</p>
                        <p className="text-sm">
                          {currentStep === 1 &&
                            "Enter your job title to get started. Be specific to receive tailored AI suggestions."}
                          {currentStep === 2 &&
                            "Your summary is looking good! Consider adding specific achievements with metrics."}
                          {currentStep === 3 &&
                            "Education details help establish your qualifications. Add relevant coursework if applicable."}
                          {currentStep === 4 &&
                            "Great skills list! Consider organizing them by proficiency level."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI-Generated Cover Letter */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">AI Cover Letter</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Generate
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Generate a custom cover letter based on your
                              profile
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="p-4 border rounded-md bg-muted/50">
                      <p className="text-sm italic text-muted-foreground">
                        Generate a custom cover letter for your job applications
                        based on your resume and the job description.
                      </p>
                      <Button className="mt-3 w-full">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Create Cover Letter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Create from Scratch Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Step-by-Step Form */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      Create Your Resume
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      Step {currentStep} of 4
                    </div>
                  </div>

                  {/* Step 1: Job Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">
                          What job are you applying for?
                        </Label>
                        <Input
                          id="jobTitle"
                          placeholder="e.g., Senior Frontend Developer"
                          value={resumeData.jobTitle}
                          onChange={(e) =>
                            handleInputChange("jobTitle", e.target.value)
                          }
                        />
                      </div>

                      <Button
                        onClick={generateAiContent}
                        disabled={!resumeData.jobTitle || isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating content...
                          </>
                        ) : (
                          <>
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Generate AI Content
                          </>
                        )}
                      </Button>

                      <div className="flex justify-end">
                        <Button
                          onClick={nextStep}
                          disabled={!resumeData.jobTitle}
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Summary & Experience */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          placeholder="Write a brief summary of your professional background and goals"
                          className="min-h-[100px]"
                          value={resumeData.summary}
                          onChange={(e) =>
                            handleInputChange("summary", e.target.value)
                          }
                        />

                        {/* AI Suggestion */}
                        {aiSuggestions.summary && (
                          <div className="mt-2 p-3 bg-muted rounded-md border border-border">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-grow">
                                <p className="text-sm font-medium">
                                  AI Suggestion:
                                </p>
                                <p className="text-sm">
                                  {aiSuggestions.summary}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={acceptSummarySuggestion}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                  >
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Regenerate
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Dismiss
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Work Experience</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addExperience}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Experience
                          </Button>
                        </div>

                        {resumeData.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="space-y-3 p-4 border rounded-md"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`company-${index}`}>
                                  Company
                                </Label>
                                <Input
                                  id={`company-${index}`}
                                  placeholder="Company name"
                                  value={exp.company}
                                  onChange={(e) =>
                                    handleExperienceChange(
                                      index,
                                      "company",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`position-${index}`}>
                                  Position
                                </Label>
                                <Input
                                  id={`position-${index}`}
                                  placeholder="Job title"
                                  value={exp.position}
                                  onChange={(e) =>
                                    handleExperienceChange(
                                      index,
                                      "position",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`duration-${index}`}>
                                Duration
                              </Label>
                              <Input
                                id={`duration-${index}`}
                                placeholder="e.g., Jan 2020 - Present"
                                value={exp.duration}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "duration",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`description-${index}`}>
                                Description
                              </Label>
                              <Textarea
                                id={`description-${index}`}
                                placeholder="Describe your responsibilities and achievements"
                                className="min-h-[80px]"
                                value={exp.description}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* AI Suggestion for Experience */}
                            {aiSuggestions.experience[0] && index === 0 && (
                              <div className="p-3 bg-muted rounded-md border border-border">
                                <div className="flex items-start gap-2">
                                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                  <div className="flex-grow">
                                    <p className="text-sm font-medium">
                                      AI Suggestion:
                                    </p>
                                    <p className="text-sm">
                                      {aiSuggestions.experience[0]}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs"
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Dismiss
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <Button onClick={nextStep}>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Education */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Education</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addEducation}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Education
                          </Button>
                        </div>

                        {resumeData.education.map((edu, index) => (
                          <div
                            key={index}
                            className="space-y-3 p-4 border rounded-md"
                          >
                            <div className="space-y-2">
                              <Label htmlFor={`school-${index}`}>
                                School/University
                              </Label>
                              <Input
                                id={`school-${index}`}
                                placeholder="School or university name"
                                value={edu.school}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "school",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${index}`}>Degree</Label>
                              <Input
                                id={`degree-${index}`}
                                placeholder="e.g., Bachelor of Science in Computer Science"
                                value={edu.degree}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "degree",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`year-${index}`}>Year</Label>
                              <Input
                                id={`year-${index}`}
                                placeholder="e.g., 2015 - 2019"
                                value={edu.year}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "year",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <Button onClick={nextStep}>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Skills */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Skills</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addSkill}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Skill
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {resumeData.skills.map((skill, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder="e.g., JavaScript, Project Management"
                                value={skill}
                                onChange={(e) =>
                                  handleSkillChange(index, e.target.value)
                                }
                              />
                            </div>
                          ))}
                        </div>

                        {/* AI Suggestion for Skills */}
                        {aiSuggestions.skills[0] && (
                          <div className="p-3 bg-muted rounded-md border border-border">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <div className="flex-grow">
                                <p className="text-sm font-medium">
                                  AI Suggestion:
                                </p>
                                <p className="text-sm">
                                  {aiSuggestions.skills[0]}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Dismiss
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <Button>
                          <FileText className="h-4 w-4 mr-2" />
                          Finalize Resume
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Live Preview</h2>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="border rounded-lg p-6">
                    {resumeData.jobTitle ? (
                      <>
                        <h3 className="text-xl font-bold">Jane Doe</h3>
                        <p className="text-muted-foreground">
                          {resumeData.jobTitle}
                        </p>

                        <Separator className="my-4" />

                        {resumeData.summary && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Star className="h-4 w-4 mr-2" />
                              Summary
                            </h4>
                            <p className="text-sm">{resumeData.summary}</p>
                          </div>
                        )}

                        {resumeData.experience[0].company && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Briefcase className="h-4 w-4 mr-2" />
                              Experience
                            </h4>
                            {resumeData.experience.map(
                              (exp, index) =>
                                exp.company && (
                                  <div key={index} className="mb-3">
                                    <div className="flex justify-between">
                                      <p className="font-medium">
                                        {exp.position}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {exp.duration}
                                      </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {exp.company}
                                    </p>
                                    <p className="text-sm mt-1">
                                      {exp.description}
                                    </p>
                                  </div>
                                )
                            )}
                          </div>
                        )}

                        {resumeData.education[0].school && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <GraduationCap className="h-4 w-4 mr-2" />
                              Education
                            </h4>
                            {resumeData.education.map(
                              (edu, index) =>
                                edu.school && (
                                  <div key={index} className="mb-2">
                                    <div className="flex justify-between">
                                      <p className="font-medium">
                                        {edu.school}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {edu.year}
                                      </p>
                                    </div>
                                    <p className="text-sm">{edu.degree}</p>
                                  </div>
                                )
                            )}
                          </div>
                        )}

                        {resumeData.skills[0] && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Award className="h-4 w-4 mr-2" />
                              Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.map(
                                (skill, index) =>
                                  skill && (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="px-3 py-1"
                                    >
                                      {skill}
                                    </Badge>
                                  )
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Your resume preview will appear here</p>
                        <p className="text-sm">
                          Start by entering your job title in step 1
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Real-time feedback */}
                  {resumeData.jobTitle && (
                    <div className="mt-4 p-3 bg-muted rounded-md border border-border">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">AI Feedback:</p>
                          <p className="text-sm">
                            {currentStep === 1 &&
                              "Enter your job title to get started. Be specific to receive tailored AI suggestions."}
                            {currentStep === 2 &&
                              "Your summary is looking good! Consider adding specific achievements with metrics."}
                            {currentStep === 3 &&
                              "Education details help establish your qualifications. Add relevant coursework if applicable."}
                            {currentStep === 4 &&
                              "Great skills list! Consider organizing them by proficiency level."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI-Generated Cover Letter */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                          AI Cover Letter
                        </h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Generate
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Generate a custom cover letter based on your
                                profile
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="p-4 border rounded-md bg-muted/50">
                        <p className="text-sm italic text-muted-foreground">
                          Generate a custom cover letter for your job
                          applications based on your resume and the job
                          description.
                        </p>
                        <Button className="mt-3 w-full">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Create Cover Letter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
