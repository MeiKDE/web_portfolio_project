import prisma from "@/lib/prisma";

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        experiences: true,
        education: true,
        skills: true,
        certifications: true,
        projects: true,
        socialLinks: true,
      },
    });

    // Handle case where user might not have the new fields yet
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}

export async function updateUserProfile(userId: string, profileData: any) {
  try {
    // Extract related data that needs to be handled separately
    const {
      workExperience,
      education,
      skills,
      certifications,
      projects,
      socialLinks,
      ...userData
    } = profileData;

    // Start a transaction to update all related data
    const result = await prisma.$transaction(async (tx) => {
      // Update user data
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          ...userData,
          isUploadResumeForProfile: true,
          hasCompletedProfileSetup: true,
        },
      });

      // Handle work experience if provided
      if (workExperience && Array.isArray(workExperience)) {
        // Delete existing experiences and create new ones
        await tx.experience.deleteMany({
          where: { userId },
        });

        for (const exp of workExperience) {
          await tx.experience.create({
            data: {
              ...exp,
              userId,
              startDate: new Date(exp.startDate),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
            },
          });
        }
      }

      // Handle education if provided
      if (education && Array.isArray(education)) {
        await tx.education.deleteMany({
          where: { userId },
        });

        for (const edu of education) {
          await tx.education.create({
            data: {
              ...edu,
              userId,
              startYear: parseInt(edu.startYear),
              endYear: parseInt(edu.endYear),
            },
          });
        }
      }

      // Handle skills if provided
      if (skills && Array.isArray(skills)) {
        await tx.skill.deleteMany({
          where: { userId },
        });

        for (const skill of skills) {
          await tx.skill.create({
            data: {
              name: typeof skill === "string" ? skill : skill.name,
              category: typeof skill === "string" ? "General" : skill.category,
              proficiencyLevel:
                typeof skill === "string" ? 3 : skill.proficiencyLevel,
              userId,
            },
          });
        }
      }

      return updatedUser;
    });

    return result;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}
