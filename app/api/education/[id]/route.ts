//Summary
// This file ([id]/route.ts) is focused on managing existing education entries (updating and deleting).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// UPDATE an education entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the education entry to check ownership
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!existingEducation) {
      return NextResponse.json(
        { error: "Education entry not found" },
        { status: 404 }
      );
    }

    // Verify the user is modifying their own data
    if (existingEducation.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    console.log("Updating education with data:", data);

    const education = await prisma.education.update({
      where: { id: params.id },
      data,
    });

    console.log("Updated education:", education);
    return NextResponse.json(education);
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json(
      { error: "Failed to update education" },
      { status: 500 }
    );
  }
}

// DELETE an education entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the education entry to check ownership
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id },
    });

    if (!existingEducation) {
      return NextResponse.json(
        { error: "Education entry not found" },
        { status: 404 }
      );
    }

    // Verify the user is modifying their own data
    if (existingEducation.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.education.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Education entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    );
  }
}
