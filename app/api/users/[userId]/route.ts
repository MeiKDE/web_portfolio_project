//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (getting and updating).

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import prisma from '@/lib/prisma';
const prisma = new PrismaClient();

// GET user by ID from User table
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {

    const user = await prisma.user.findFirst({
      where: { id: params.userId},
    });

    // Log the user data retrieved from the database
    console.log('User data retrieved for ID', params.userId, ':', user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// UPDATE user
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    
    const updatedUser = await prisma.User.update({
      where: { id: params.userId },
      data,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 