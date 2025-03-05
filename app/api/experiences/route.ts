import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all experiences
export async function GET(request: NextRequest) {
  try {
    const experiences = await prisma.experience.findMany();
    // console.log("ln8: experiences from route.ts", experiences);
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
} 