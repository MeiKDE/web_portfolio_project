//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// UPDATE a certification (professional, education, etc)
export async function PUT(
  request: NextRequest, //extends Request object
  { params }: { params: { id: string } } //indicates that params is an object that contains a property id, which is of type string.
) {
  try {
    const data = await request.json(); //equivalent to request.body.data
    
    const certification = await prisma.certification.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(certification);
  } catch (error) {
    console.error('Error updating certification:', error);
    return NextResponse.json(
      { error: 'Failed to update certification' },
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

    return NextResponse.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    );
  }
} 