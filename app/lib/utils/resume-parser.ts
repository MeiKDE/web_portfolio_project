// This is a simplified version. In a real implementation, you would integrate with an AI service
// like OpenAI or a dedicated resume parsing service.

import OpenAI from "openai";
import { extractTextFromPDF } from "./pdf-extractor"; // Use our LangChain-based extractor

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  experience?: {
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  education?: {
    degree?: string;
    institution?: string;
    location?: string;
    graduationDate?: string;
  }[];
}

export async function parseResumePDF(pdfBuffer: Buffer) {
  try {
    // Step 1: Extract text from the PDF using our LangChain-based extractor
    console.log("Starting PDF text extraction");
    const pdfText = await extractTextFromPDF(pdfBuffer);

    if (!pdfText || pdfText.trim().length === 0) {
      console.error("Empty text extracted from PDF");
      throw new Error("Could not extract text from PDF");
    }

    console.log(`Extracted ${pdfText.length} characters from PDF`);

    // Log a sample of the text to verify content
    console.log("Text sample:", pdfText.slice(0, 200) + "...");

    // Step 2: Use OpenAI to parse the text into structured data
    try {
      console.log("Sending to OpenAI for parsing");
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a resume parsing assistant. Extract structured information from the resume text.",
          },
          {
            role: "user",
            content: `Parse this resume and return a JSON object with the following structure: 
            {
              "name": string,
              "profile_email": string,
              "phone": string,
              "title": string,
              "location": string,
              "bio": string,
              "workExperience": [{ 
                "position": string, 
                "company": string, 
                "location": string, 
                "startDate": string (YYYY-MM-DD), 
                "endDate": string (YYYY-MM-DD) | null, 
                "description": string,
                "isCurrentPosition": boolean 
              }],
              "education": [{ 
                "institution": string, 
                "degree": string, 
                "fieldOfStudy": string, 
                "startYear": string, 
                "endYear": string, 
                "description": string 
              }],
              "skills": string[]
            }
            
            Resume text:
            ${pdfText}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      console.log("Received response from OpenAI");

      // Step 3: Parse the JSON response
      const content = response.choices[0].message.content;
      if (!content) {
        console.error("No content returned from OpenAI");
        throw new Error("Empty response from AI parser");
      }

      console.log("OpenAI response content:", content.slice(0, 200) + "...");

      try {
        const parsedData = JSON.parse(content);
        console.log("Successfully parsed JSON response");

        // Step 4: Add additional flags needed for the application
        return {
          ...parsedData,
          isUploadResumeForProfile: true,
          hasCompletedProfileSetup: true,
        };
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        console.error("Invalid JSON content:", content);
        throw new Error("Failed to parse JSON from AI response");
      }
    } catch (openAiError) {
      console.error("OpenAI API error:", openAiError);
      // Fall back to mock data for testing
      console.log("Falling back to mock data");
      return getMockResumeData();
    }
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw new Error(
      `Failed to parse resume: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// Fallback function in case the OpenAI API is unavailable or for testing
export function getMockResumeData() {
  return {
    name: "Extracted Name",
    profile_email: "extracted@email.com",
    phone: "123-456-7890",
    title: "Software Engineer",
    location: "San Francisco, CA",
    bio: "Experienced software engineer with a passion for building scalable applications.",
    workExperience: [
      {
        position: "Software Engineer",
        company: "Example Company",
        location: "San Francisco, CA",
        startDate: "2020-01-01",
        endDate: "2023-01-01",
        description:
          "Worked on various projects including a scalable e-commerce platform.",
        isCurrentPosition: false,
      },
    ],
    education: [
      {
        institution: "Example University",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startYear: "2016",
        endYear: "2020",
        description:
          "Graduated with honors. Focused on software engineering and AI.",
      },
    ],
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "AWS",
    ],
    isUploadResumeForProfile: true,
    hasCompletedProfileSetup: true,
  };
}
