import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { extractTextFromPDF } from "@/lib/pdf-extractor";
import { parseResumePDF } from "@/lib/resume-parser";
import { updateUserProfile } from "@/lib/user-service";
import prisma from "@/lib/prisma";

// Helper function to convert text to title case
function toTitleCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(errorResponse("User ID not found in session"), {
        status: 400,
      });
    }

    console.log("Processing resume for user ID:", userId);

    // Check if user exists before proceeding
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        return NextResponse.json(
          errorResponse(`User with ID ${userId} not found in database`),
          { status: 404 }
        );
      }
    } catch (userError) {
      console.error("Error checking user:", userError);
      return NextResponse.json(errorResponse("Failed to verify user account"), {
        status: 500,
      });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(errorResponse("No resume file provided"), {
        status: 400,
      });
    }

    // Check file type
    if (!file.type.includes("pdf")) {
      return NextResponse.json(errorResponse("Only PDF files are supported"), {
        status: 400,
      });
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
        return NextResponse.json(
          errorResponse(
            "Failed to parse resume - could not extract structured data"
          ),
          { status: 400 }
        );
      }

      console.log("Resume data parsed successfully");

      // Update user profile with parsed data
      // Store resumeData.email in profile_email if it exists
      await prisma.user.update({
        where: { id: userId },
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

      return NextResponse.json(
        successResponse({
          message: "Resume uploaded and parsed successfully",
          data: { resumeData },
        })
      );
    } catch (extractError) {
      console.error("PDF processing error:", extractError);
      return NextResponse.json(
        errorResponse(
          extractError instanceof Error
            ? `PDF processing error: ${extractError.message}`
            : "Failed to process PDF file"
        ),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      errorResponse(
        error instanceof Error ? error.message : "Failed to process resume"
      ),
      { status: 500 }
    );
  }
}
