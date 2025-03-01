//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// UPDATE an education entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json(); //equivalent to request.body.data
    
    const education = await prisma.education.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json(
      { error: 'Failed to update education' },
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
    await prisma.education.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json(
      { error: 'Failed to delete education' },
      { status: 500 }
    );
  }
} 