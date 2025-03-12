import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET current user's profile
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
        // Exclude sensitive information like password
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("ln38: Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// UPDATE current user's profile
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    console.log("ln52: session", session);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the updated data
    const data = await request.json();

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        title: data.title,
        location: data.location,
        phone: data.phone,
        bio: data.bio,
        // Don't allow updating email through this endpoint for security
        // Don't update password here - should have a separate endpoint with proper validation
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        location: true,
        phone: true,
        bio: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("ln96: Error updating user profile:", error);
    return NextResponse.json(
      { error: "ln97: Failed to update user profile" },
      { status: 500 }
    );
  }
}
