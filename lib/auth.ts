import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    const accessToken = cookies().get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // Find session
    const session = await prisma.session.findFirst({
      where: {
        accessToken,
        expiresAt: { gt: new Date() }, // Check if session is not expired
      },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = session.user;

    return userWithoutPassword;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
