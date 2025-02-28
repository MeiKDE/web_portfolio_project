import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all certifications for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const certifications = await prisma.certification.findMany({
      where: { userId: params.userId },
      orderBy: { issueDate: 'desc' },
    });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}

// CREATE a new certification
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    
    const certification = await prisma.certification.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    );
  }
} 