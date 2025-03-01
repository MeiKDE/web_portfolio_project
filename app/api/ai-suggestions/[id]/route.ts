//Summary
// This file ([id]/route.ts) is focused on managing existing suggestions (updating and deleting).

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// UPDATE an AI suggestion (e.g., accept, reject, regenerate)
export async function PUT(
  request: NextRequest, //extends Request object

  //instead of accessing params through args.params, you can directly use params.
  //indicates that params is an object that contains a property id, which is of type string.
  { params }: { params: { id: string } } 
) {
  try {
    const { status } = await request.json(); //destructure: equivalent to request.body.status
    
    const aiSuggestion = await prisma.aiSuggestion.update({
      where: { id: params.id }, // Accessing the id parameter
      data: { status }, //update the status of the aiSuggestion
    });

    // If the suggestion was accepted, you might want to apply the suggestion
    // to the target entity (experience, skill, etc.)
    if (status === 'accepted' && aiSuggestion.targetId) {
      // This would depend on the type of suggestion and target
      // For example, if it's a skill suggestion:
      if (aiSuggestion.targetType === 'skill' && aiSuggestion.suggestion.includes('Add')) { 
        // Extract the skill name from the suggestion
        const skillName = aiSuggestion.suggestion.split('Add ')[1].split(' to')[0];
        console.log(`ln28: skillName: ${skillName}`);

        // Check if the skill already exists
        const existingSkill = await prisma.skill.findFirst({
          where: {
            userId: aiSuggestion.userId,
            name: skillName,
          },
        });
        console.log(`ln30: existingSkill: ${existingSkill}`);
        // If not, create it
        if (!existingSkill) {
          await prisma.skill.create({
            data: {
              name: skillName,
              userId: aiSuggestion.userId,
            },
          });
        }
      }
      // Similar logic for other target types
    }

    return NextResponse.json(aiSuggestion);
  } catch (error) {
    console.error('Error updating AI suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to update AI suggestion' },
      { status: 500 }
    );
  }
}

// DELETE an AI suggestion
export async function DELETE(
  request: NextRequest, //extends Request object
  { params }: { params: { id: string } } //indicates that params is an object that contains a property id, which is of type string.
) {
  try {
    await prisma.aiSuggestion.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'AI suggestion deleted successfully' });
  } catch (error) {
    console.error('Error deleting AI suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to delete AI suggestion' },
      { status: 500 }
    );
  }
} 