//Summary
// This file (skills/route.ts) is focused on getting all skills for a user. 

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all skills for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const skills = await prisma.skill.findMany({
      where: { userId: params.userId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// CREATE a new skill
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    
    const skill = await prisma.skill.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
} 