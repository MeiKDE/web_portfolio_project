import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { parseResumePDF } from "@/lib/resume-parser";
import { updateUserProfile } from "@/lib/user-service";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse("Unauthorized", 401);
    }

    // Get the form data with the file
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return errorResponse("No file uploaded", 400);
    }

    // Check file type
    if (file.type !== "application/pdf") {
      return errorResponse("Only PDF files are accepted", 400);
    }

    // Convert file to buffer for processing
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse the resume using AI
    const parsedData = await parseResumePDF(buffer);

    // Update user profile with parsed data
    await updateUserProfile(session.user.id, parsedData);

    return successResponse({
      message: "Resume uploaded and parsed successfully",
      data: parsedData,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return errorResponse("Failed to process resume", 500);
  }
}
