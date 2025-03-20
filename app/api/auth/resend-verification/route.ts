import { sendVerificationEmail } from "@/lib/email";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import * as crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return errorResponse("Email is required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    if (user.emailVerified) {
      return errorResponse("Email already verified", 400);
    }

    // Generate a new verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Save the verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send the verification email
    await sendVerificationEmail(email, token);

    return successResponse({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return errorResponse("Internal server error", 500);
  }
}
