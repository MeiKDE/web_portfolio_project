import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// UPDATE an AI suggestion (e.g., accept, reject, regenerate)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    
    const aiSuggestion = await prisma.aiSuggestion.update({
      where: { id: params.id },
      data: { status },
    });

    // If the suggestion was accepted, you might want to apply the suggestion
    // to the target entity (experience, skill, etc.)
    if (status === 'accepted' && aiSuggestion.targetId) {
      // This would depend on the type of suggestion and target
      // For example, if it's a skill suggestion:
      if (aiSuggestion.targetType === 'skill' && aiSuggestion.suggestion.includes('Add')) {
        // Extract the skill name from the suggestion
        const skillName = aiSuggestion.suggestion.split('Add ')[1].split(' to')[0];
        
        // Check if the skill already exists
        const existingSkill = await prisma.skill.findFirst({
          where: {
            userId: aiSuggestion.userId,
            name: skillName,
          },
        });
        
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
  request: NextRequest,
  { params }: { params: { id: string } }
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