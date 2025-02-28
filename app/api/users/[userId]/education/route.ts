import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all education entries for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const education = await prisma.education.findMany({
      where: { userId: params.userId },
      orderBy: { endYear: 'desc' },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}

// CREATE a new education entry
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    
    const education = await prisma.education.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    );
  }
} 