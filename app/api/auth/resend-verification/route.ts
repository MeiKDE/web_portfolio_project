import { sendVerification } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

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

    await sendVerification(email);

    return successResponse({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return errorResponse("Internal server error", 500);
  }
}
