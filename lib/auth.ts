import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

// Get the current user from the session
export async function getCurrentUser() {
  try {
    const accessToken = cookies().get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // Find the session
    const session = await prisma.session.findFirst({
      where: {
        accessToken,
        expiresAt: {
          gt: new Date(), // Session hasn't expired
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    // Return the user without the password
    const { password, ...userWithoutPassword } = session.user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Verify if a token is valid
export async function verifyToken(accessToken: string) {
  try {
    // Check if the token exists in the database and is not expired
    const session = await prisma.session.findFirst({
      where: {
        accessToken,
        expiresAt: {
          gt: new Date(), // Session hasn't expired
        },
      },
    });

    return !!session; // Return true if session exists, false otherwise
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}
