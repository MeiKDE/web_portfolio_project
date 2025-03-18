import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { extractTextFromPDF } from "@/lib/pdf-extractor";
import { parseResumePDF } from "@/lib/resume-parser";
import { updateUserProfile } from "@/lib/user-service";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return errorResponse(401, "Unauthorized");
    }

    // Get user ID from session
    const userId = session.user.id;
    if (!userId) {
      return errorResponse(400, "User ID not found in session");
    }

    console.log("Processing resume for user ID:", userId);

    // Check if user exists before proceeding
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        return errorResponse(
          404,
          `User with ID ${userId} not found in database`
        );
      }
    } catch (userError) {
      console.error("Error checking user:", userError);
      return errorResponse(500, "Failed to verify user account");
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || !(file instanceof File)) {
      return errorResponse(400, "No resume file provided");
    }

    // Check file type
    if (!file.type.includes("pdf")) {
      return errorResponse(400, "Only PDF files are supported");
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
          400,
          "Failed to parse resume - could not extract structured data"
        );
      }

      console.log("Resume data parsed successfully");

      // Update user profile with parsed data
      await updateUserProfile(userId, resumeData);
      console.log("User profile updated successfully");

      return successResponse({
        message: "Resume uploaded and parsed successfully",
        data: { resumeData },
      });
    } catch (extractError) {
      console.error("PDF processing error:", extractError);
      return errorResponse(
        500,
        extractError instanceof Error
          ? `PDF processing error: ${extractError.message}`
          : "Failed to process PDF file"
      );
    }
  } catch (error) {
    console.error("Resume upload error:", error);
    return errorResponse(
      500,
      error instanceof Error ? error.message : "Failed to process resume"
    );
  }
}
