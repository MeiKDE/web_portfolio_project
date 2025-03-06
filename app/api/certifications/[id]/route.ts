//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// UPDATE a certification
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Ensure all fields are included in the update
    const certification = await prisma.certification.update({
      where: { id: params.id },
      data: {
        name: data.name,
        issuer: data.issuer,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        credentialUrl: data.credentialUrl,
      },
    });

    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json(
      { error: "Failed to update certification" },
      { status: 500 }
    );
  }
}

// DELETE a certification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.certification.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Certification deleted successfully" });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json(
      { error: "Failed to delete certification" },
      { status: 500 }
    );
  }
}
