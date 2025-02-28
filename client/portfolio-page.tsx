"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Code, Eye, Plus } from "lucide-react"

// Mock data for projects
const projects = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "A full-stack e-commerce solution with React frontend and Node.js backend.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Full-Stack",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    projectUrl: "#",
    codeUrl: "#",
  },
  {
    id: 2,
    name: "Task Management App",
    description: "A React-based task management application with drag-and-drop functionality.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Frontend",
    technologies: ["React", "Redux", "Tailwind CSS"],
    projectUrl: "#",
    codeUrl: "#",
  },
  {
    id: 3,
    name: "RESTful API for Blog",
    description: "A Node.js API for a blogging platform with authentication and CRUD operations.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Backend",
    technologies: ["Node.js", "Express", "PostgreSQL", "JWT"],
    projectUrl: "#",
    codeUrl: "#",
  },
  {
    id: 4,
    name: "Weather Forecast App",
    description: "A Vue.js weather application that fetches data from a third-party API.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Frontend",
    technologies: ["Vue.js", "Axios", "OpenWeatherMap API"],
    projectUrl: "#",
    codeUrl: "#",
  },
  {
    id: 5,
    name: "Social Media Dashboard",
    description: "A full-stack social media analytics dashboard with real-time updates.",
    image: "/placeholder.svg?height=200&width=300",
    category: "Full-Stack",
    technologies: ["React", "Node.js", "Socket.io", "Chart.js"],
    projectUrl: "#",
    codeUrl: "#",
  },
]

export default function PortfolioPage() {
  const [currentCategory, setCurrentCategory] = useState("All")
  const categories = ["All", "Frontend", "Backend", "Full-Stack"]

  const filteredProjects =
    currentCategory === "All" ? projects : projects.filter((project) => project.category === currentCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>

      <Tabs defaultValue="All" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} onClick={() => setCurrentCategory(category)}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <img src={project.image || "/placeholder.svg"} alt={project.name} className="w-full h-48 object-cover" />
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted p-4 flex justify-between">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Project
              </Button>
              <Button variant="outline" size="sm">
                <Code className="h-4 w-4 mr-2" />
                View Code
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Add New Project Card */}
        <Card className="flex flex-col items-center justify-center p-6 border-dashed">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Add New Project</h3>
          <p className="text-center text-muted-foreground mb-4">
            Showcase your latest work by adding a new project to your portfolio.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </Card>
      </div>

      {/* AI Suggestion */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">AI Suggestion</h3>
              <p className="text-muted-foreground mb-4">
                You mentioned Python in your resume, but you don't have any Python projects in your portfolio. Would you
                like to add a Python project to showcase your skills?
              </p>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Python Project
                </Button>
                <Button variant="ghost">Dismiss</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

