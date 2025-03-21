import { NextRequest, NextResponse } from "next/server";
import {
  successResponse,
  errorResponse,
  withAuth,
} from "@/app/lib/api/api-helpers";
import { parseResumePDF } from "@/app/lib/utils/resume-parser";
import prisma from "@/app/lib/db/prisma";

// Helper function to convert text to title case
function toTitleCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const POST = withAuth(async (request: NextRequest, context, user) => {
  try {
    console.log("Processing resume for user ID:", user.id);

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || !(file instanceof File)) {
      return errorResponse("No resume file provided", 400);
    }

    // Check file type
    if (!file.type.includes("pdf")) {
      return errorResponse("Only PDF files are supported", 400);
    }

    console.log("Processing resume file:", file.name, "Size:", file.size);

    try {
      // Extract text from PDF
      const pdfBuffer = Buffer.from(await file.arrayBuffer());
      console.log("PDF buffer created, size:", pdfBuffer.length);

      // Pass the buffer directly to parseResumePDF which does its own text extraction
      const resumeData = await parseResumePDF(pdfBuffer);

      console.log("ln67 check resumeData from openai", resumeData);

      if (!resumeData) {
        return errorResponse(
          "Failed to parse resume - could not extract structured data",
          400
        );
      }

      console.log("Resume data parsed successfully");

      // Update user profile with parsed data
      // Store resumeData.email in profile_email if it exists
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: resumeData.name ? toTitleCase(resumeData.name) : undefined,
          title: resumeData.title ? toTitleCase(resumeData.title) : undefined,
          location: resumeData.location
            ? toTitleCase(resumeData.location)
            : undefined,
          bio: resumeData.bio,
          ...(resumeData.email ? { profile_email: resumeData.email } : {}),
        },
      });
      console.log("User profile updated successfully");

      return successResponse({
        message: "Resume uploaded and parsed successfully",
        resumeData,
      });
    } catch (extractError) {
      console.error("PDF processing error:", extractError);
      return errorResponse(
        extractError instanceof Error
          ? `PDF processing error: ${extractError.message}`
          : "Failed to process PDF file",
        500
      );
    }
  } catch (error) {
    console.error("Resume upload error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to process resume",
      500
    );
  }
});
