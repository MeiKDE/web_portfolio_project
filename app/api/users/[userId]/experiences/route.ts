import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all experiences for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const experiences = await prisma.experience.findMany({
      where: { userId: params.userId },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// CREATE a new experience
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    
    const experience = await prisma.experience.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
} 