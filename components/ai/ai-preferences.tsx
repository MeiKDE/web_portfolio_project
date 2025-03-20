"use client"

// Completely replace the AIPreferences component to include examples directly in the preferences tab
// and use color coding for different categories

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface AIPreferencesProps {
  preferences: {
    careerGoals: string
    personalityTraits: string
    workStyle: string
  }
  setPreferences: (preferences: any) => void
  onNext: () => void
}

export function AIPreferences({ preferences, setPreferences, onNext }: AIPreferencesProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const examples = {
    careerGoals: [
      "Passionate about leveraging AI and automation to enhance decision-making processes and drive business growth.",
      "Seeking to advance into a leadership role where I can mentor junior analysts while solving complex business challenges.",
      "Aiming to bridge the gap between technical data insights and strategic business decisions to create measurable impact.",
    ],
    personalityTraits: [
      "Detail-oriented and analytical with a creative approach to problem-solving and a commitment to delivering high-quality work.",
      "Adaptable and resilient professional who thrives under pressure and consistently meets tight deadlines without compromising quality.",
      "Naturally curious with a growth mindset, constantly seeking to expand my knowledge and skills in the ever-evolving data landscape.",
    ],
    workStyle: [
      "I thrive in collaborative environments where diverse perspectives contribute to innovative solutions, while maintaining the ability to work independently when needed.",
      "I excel in fast-paced settings that require quick pivots and strategic thinking, always maintaining a focus on delivering actionable insights.",
      "I prefer a balanced approach that combines methodical analysis with agile execution, ensuring both accuracy and timely delivery of results.",
    ],
  }

  const categoryColors = {
    careerGoals: "bg-blue-50 border-blue-200",
    personalityTraits: "bg-purple-50 border-purple-200",
    workStyle: "bg-emerald-50 border-emerald-200",
  }

  const categoryIcons = {
    careerGoals: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-500"
      >
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
      </svg>
    ),
    personalityTraits: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-500"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    workStyle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-500"
      >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  }

  const categoryTitles = {
    careerGoals: "Career Goals",
    personalityTraits: "Personality Traits",
    workStyle: "Work Style",
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleSelectExample = (category: string, example: string) => {
    setPreferences({
      ...preferences,
      [category]: example,
    })
  }

  return (
    <div className="space-y-6">
      {Object.entries(examples).map(([category, categoryExamples]) => (
        <Card key={category} className={`${categoryColors[category as keyof typeof categoryColors]} border`}>
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center gap-2">
              {categoryIcons[category as keyof typeof categoryIcons]}
              <h3 className="text-lg font-medium">{categoryTitles[category as keyof typeof categoryTitles]}</h3>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="mb-3">
              <textarea
                className="w-full p-3 border rounded-md h-20 resize-none bg-white"
                placeholder={`Enter your ${categoryTitles[category as keyof typeof categoryTitles].toLowerCase()}...`}
                value={preferences[category as keyof typeof preferences]}
                onChange={(e) => setPreferences({ ...preferences, [category]: e.target.value })}
              />
            </div>

            <Accordion type="multiple" value={expandedSections} className="border rounded-md bg-white">
              <AccordionItem value={category}>
                <AccordionTrigger onClick={() => toggleSection(category)} className="px-4">
                  See examples
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-3 space-y-2">
                  {categoryExamples.map((example, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-md cursor-pointer hover:border-primary transition-colors ${
                        preferences[category as keyof typeof preferences] === example
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleSelectExample(category, example)}
                    >
                      <p className="text-sm">{example}</p>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end pt-2">
        <Button onClick={onNext} className="flex items-center gap-1">
          Generate Bio
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
            className="lucide lucide-wand-sparkles"
          >
            <path d="m6 12 6-6 6 6-6 6-6-6Z" />
            <path d="m2 22 3-3" />
            <path d="M18 3h4v4" />
            <path d="m21 3-3 3" />
            <path d="M2 8V4h4" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

