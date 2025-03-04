"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Edit } from "lucide-react"

interface EducationProps {
  education?: {
    institution: string;
    degree: string;
    startYear: string;
    description?: string;
  }[];
  editable?: boolean;
}

export default function Education({ education = [], editable = true }: EducationProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Education
          </h3>
          {editable && (
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
 
        {education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={"/placeholder.svg?height=48&width=48"} alt="University logo" />
                  <AvatarFallback>{edu.institution.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold">{edu.institution}</h4>
                <p className="text-muted-foreground">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.startYear}</p>
                {edu.description && <p className="mt-2">{edu.description}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-sm">No education information available</div>
        )}
      </CardContent>
    </Card>
  )
}
