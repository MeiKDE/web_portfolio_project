//Summary
// This file (social-links/route.ts) is focused on getting all social links for a user. 

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all social links for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { userId: params.userId },
      orderBy: { platform: 'asc' },
    });

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social links' },
      { status: 500 }
    );
  }
}

// CREATE a new social link
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    
    const socialLink = await prisma.socialLink.create({
      data: {
        ...data,
        userId: params.userId,
      },
    });

    return NextResponse.json(socialLink, { status: 201 });
  } catch (error) {
    console.error('Error creating social link:', error);
    return NextResponse.json(
      { error: 'Failed to create social link' },
      { status: 500 }
    );
  }
} 