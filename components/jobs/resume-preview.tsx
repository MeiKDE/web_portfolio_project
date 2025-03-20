"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ResumePreviewProps {
  resumeData: any
  isGenerating: boolean
}

export function ResumePreview({ resumeData, isGenerating }: ResumePreviewProps) {
  if (isGenerating) {
    return (
      <Card className="border border-gray-200 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-primary mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-sm text-gray-500">Generating your tailored resume...</p>
        </div>
      </Card>
    )
  }

  if (!resumeData) {
    return (
      <Card className="border border-gray-200 h-[600px] flex items-center justify-center">
        <div className="text-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 mx-auto mb-4"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No resume generated yet</h3>
          <p className="mt-1 text-sm text-gray-500">Click the Generate button to create a tailored resume</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-200 h-[600px] overflow-y-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold">{resumeData.name}</h1>
            <p className="text-gray-600">{resumeData.title}</p>
            <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
              <span>{resumeData.contact.email}</span>
              <span>{resumeData.contact.phone}</span>
              <span>{resumeData.contact.location}</span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Professional Summary</h2>
            <p className="text-sm">{resumeData.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Work Experience</h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium">{exp.company}</h3>
                    <span className="text-sm text-gray-500">{exp.years}</span>
                  </div>
                  <p className="text-sm font-medium">{exp.title}</p>
                  <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                    {exp.highlights.map((highlight: string, i: number) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-sm rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {resumeData.education.map((edu: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium">{edu.institution}</h3>
                    <span className="text-sm text-gray-500">{edu.year}</span>
                  </div>
                  <p className="text-sm">{edu.degree}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">Certifications</h2>
            <ul className="list-disc pl-5 text-sm">
              {resumeData.certifications.map((cert: string, index: number) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

