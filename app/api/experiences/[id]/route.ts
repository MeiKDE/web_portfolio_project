//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Define the same schema as in the other file
const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  description: z.string().min(1, "Description is required"),
  isCurrentPosition: z.boolean().optional().default(false),
});

// UPDATE an experience
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Validate the incoming data
    const validationResult = experienceSchema.partial().safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid experience data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error updating experience:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to update experience", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

// DELETE an experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.experience.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
