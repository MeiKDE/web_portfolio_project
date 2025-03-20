"use client"

import { Card, CardContent } from "@/components/ui/card"

interface CoverLetterPreviewProps {
  coverLetterData: any
  isGenerating: boolean
}

export function CoverLetterPreview({ coverLetterData, isGenerating }: CoverLetterPreviewProps) {
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
          <p className="mt-4 text-sm text-gray-500">Generating your tailored cover letter...</p>
        </div>
      </Card>
    )
  }

  if (!coverLetterData) {
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
          <h3 className="text-lg font-medium text-gray-900">No cover letter generated yet</h3>
          <p className="mt-1 text-sm text-gray-500">Click the Generate button to create a tailored cover letter</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-200 h-[600px] overflow-y-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Letterhead */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold">{coverLetterData.letterhead.name}</h1>
            <p className="text-gray-600">{coverLetterData.letterhead.title}</p>
            <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
              <span>{coverLetterData.letterhead.contact.email}</span>
              <span>{coverLetterData.letterhead.contact.phone}</span>
              <span>{coverLetterData.letterhead.contact.location}</span>
            </div>
          </div>

          {/* Date */}
          <div>
            <p>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>

          {/* Content */}
          <div className="whitespace-pre-line text-sm">{coverLetterData.content}</div>
        </div>
      </CardContent>
    </Card>
  )
}

