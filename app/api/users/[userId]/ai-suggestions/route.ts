import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all AI suggestions for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const aiSuggestions = await prisma.aiSuggestion.findMany({
      where: { 
        userId: params.userId,
        status: { not: 'rejected' } // Optionally filter out rejected suggestions
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(aiSuggestions);
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI suggestions' },
      { status: 500 }
    );
  }
}

// CREATE a new AI suggestion
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    
    const aiSuggestion = await prisma.aiSuggestion.create({
      data: {
        ...data,
        userId: params.userId,
        status: 'pending',
      },
    });

    return NextResponse.json(aiSuggestion, { status: 201 });
  } catch (error) {
    console.error('Error creating AI suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to create AI suggestion' },
      { status: 500 }
    );
  }
} 