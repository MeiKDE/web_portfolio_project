import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { successResponse, errorResponse } from "@/app/lib/api/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return errorResponse("Missing verification token", 400);
    }

    // Add logging to see what token is being received
    console.log("Received verification token:", token);

    // Find user with this verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    console.log("Found token in database:", verificationToken);

    if (!verificationToken) {
      return errorResponse("Invalid verification token", 400);
    }

    // Update user as verified
    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Redirect to login page with success message
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
    );
  } catch (error) {
    console.error("Verification error:", error);
    return errorResponse("Error verifying email", 500);
  }
}
