// This would be replaced with your actual data fetching logic
export async function getJobListings() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      id: "job-1",
      title: "Senior Data Analyst",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      industry: "Technology",
      description: "We are looking for a Senior Data Analyst to join our growing team...",
      keySkills: ["SQL", "Python", "Tableau", "Data Modeling"],
      dateAdded: "2025-03-15T10:30:00Z",
      status: "applied",
      pipeline: [
        {
          stage: "applied",
          date: "2025-03-15T10:30:00Z",
          notes: "Applied through company website. Included portfolio link in application.",
        },
      ],
    },
    {
      id: "job-2",
      title: "Data Scientist",
      company: "AI Solutions",
      location: "Remote",
      industry: "Artificial Intelligence",
      description: "Join our team of data scientists working on cutting-edge AI solutions...",
      keySkills: ["Python", "Machine Learning", "TensorFlow", "NLP"],
      dateAdded: "2025-03-10T14:45:00Z",
      status: "phone-screening",
      pipeline: [
        {
          stage: "applied",
          date: "2025-03-10T14:45:00Z",
          notes: "",
        },
        {
          stage: "phone-screening",
          date: "2025-03-18T11:00:00Z",
          notes: "30-minute call with HR. Asked about experience with ML models and team collaboration.",
        },
      ],
    },
    {
      id: "job-3",
      title: "Business Intelligence Analyst",
      company: "Global Finance Corp",
      location: "New York, NY",
      industry: "Finance",
      description: "Seeking a BI Analyst to help transform our data into actionable insights...",
      keySkills: ["Power BI", "SQL", "Financial Analysis", "Excel"],
      dateAdded: "2025-03-05T09:15:00Z",
      status: "interview",
      pipeline: [
        {
          stage: "applied",
          date: "2025-03-05T09:15:00Z",
          notes: "",
        },
        {
          stage: "phone-screening",
          date: "2025-03-12T13:30:00Z",
          notes: "Spoke with team lead. Discussed previous experience with financial reporting.",
        },
        {
          stage: "interview",
          date: "2025-03-19T15:00:00Z",
          notes: "Technical interview with 3 team members. Completed a case study on financial data analysis.",
        },
      ],
    },
    {
      id: "job-4",
      title: "Data Analyst",
      company: "Health Analytics Partners",
      location: "Boston, MA",
      industry: "Healthcare",
      description: "Looking for a data analyst to help improve healthcare outcomes through data...",
      keySkills: ["SQL", "R", "Healthcare Analytics", "Statistical Analysis"],
      dateAdded: "2025-03-01T16:20:00Z",
      status: "saved",
      pipeline: [],
    },
  ]
}

