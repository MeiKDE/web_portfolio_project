// This file should be removed as NextAuth.js handles logout functionality
// NextAuth.js provides a signOut() function that should be used instead

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = cookies().get("accessToken")?.value;

    if (accessToken) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { accessToken },
      });

      // Clear cookie
      cookies().delete("accessToken");
    }

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
