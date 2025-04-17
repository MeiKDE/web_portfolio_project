import prisma from "@/app/lib/db/prisma";
// Remove the db import since it's causing an error
// import { db } from '@/lib/db'; // Assuming you have a database connection

export async function getUserProfile(userId: string) {
  try {
    console.log("Attempting to fetch user profile with ID:", userId);

    // Verify userId is valid
    if (!userId) {
      console.error("Invalid userId provided:", userId);
      throw new Error("Invalid user ID");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        experiences: true,
        education: true,
        skills: true,
      },
    });

    // Log the query result
    console.log(
      "Database query result:",
      user ? "User found" : "No user found"
    );

    if (!user) {
      // Instead of throwing error, return null or default profile
      return {
        id: userId,
        name: "",
        email: "",
        phone: "",
        profile_email: "",
        location: "",
        title: "",
        bio: "",
        hasCompletedProfileSetup: false,
        isUploadResumeForProfile: false,
        experiences: [],
        education: [],
        skills: [],
      };
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      profile_email: user.email, // Map this explicitly
      location: user.location || "",
      title: user.title || "",
      bio: user.bio || "",
      hasCompletedProfileSetup: user.hasCompletedProfileSetup ?? false,
      isUploadResumeForProfile: user.isUploadResumeForProfile ?? false,
      experiences: user.experiences,
      education: user.education,
      skills: user.skills,
    };
  } catch (error) {
    console.error("Detailed error in getUserProfile:", {
      error,
      userId,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

/**
 * Updates a user's profile with parsed resume data
 */
export async function updateUserProfile(userId: string, resumeData: any) {
  try {
    console.log(
      "ln46: Resume data received:",
      JSON.stringify(resumeData, null, 2)
    );

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Update basic user information
    if (
      resumeData.name ||
      resumeData.profile_email ||
      resumeData.phone ||
      resumeData.bio ||
      resumeData.title ||
      resumeData.location
    ) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: resumeData.name || undefined,
          phone: resumeData.phone || undefined,
          bio: resumeData.bio || resumeData.summary || undefined,
          title: resumeData.title || undefined,
          location: resumeData.location || undefined,
          // These fields do exist in your schema, so uncomment them
          isUploadResumeForProfile: true,
          hasCompletedProfileSetup: true,
        },
      });
    }

    // Process skills with safer checks
    try {
      if (
        resumeData.skills &&
        Array.isArray(resumeData.skills) &&
        resumeData.skills.length > 0
      ) {
        // First delete existing skills
        await prisma.skill.deleteMany({
          where: { userId },
        });

        // Process skills in batches to avoid connection limits
        for (const skill of resumeData.skills) {
          if (typeof skill === "string" && skill.trim()) {
            await prisma.skill.create({
              data: {
                userId,
                name: skill,
                category: "General", // Default category
              },
            });
          }
        }
      }
    } catch (skillError) {
      console.error("Error updating skills:", skillError);
      // Continue with other updates even if skills fail
    }

    // Process experience with safer validation
    try {
      const experiences = resumeData.workExperience || resumeData.experience;
      if (experiences && Array.isArray(experiences) && experiences.length > 0) {
        // First delete existing experience entries
        await prisma.experience.deleteMany({
          where: { userId },
        });

        // Then add new experience entries
        for (const exp of experiences) {
          if (exp && typeof exp === "object") {
            // Validate required dates
            const now = new Date();
            let startDate = exp.startDate ? new Date(exp.startDate) : now;

            // If startDate is invalid, use current date
            if (isNaN(startDate.getTime())) startDate = now;

            // For endDate, use current date if invalid or missing
            let endDate = exp.endDate ? new Date(exp.endDate) : now;
            if (isNaN(endDate.getTime())) endDate = now;

            await prisma.experience.create({
              data: {
                userId,
                position: exp.position || exp.title || "Untitled Position",
                company: exp.company || "Unknown Company",
                location: exp.location || "",
                startDate,
                endDate,
                description: exp.description || "",
                isCurrentPosition: Boolean(exp.isCurrentPosition),
              },
            });
          }
        }
      }
    } catch (expError) {
      console.error("Error updating experience:", expError);
      // Continue with other updates even if experience fails
    }

    // Process education with safer validation
    try {
      if (
        resumeData.education &&
        Array.isArray(resumeData.education) &&
        resumeData.education.length > 0
      ) {
        // First delete existing education entries
        await prisma.education.deleteMany({
          where: { userId },
        });

        const currentYear = new Date().getFullYear();

        // Then add new education entries
        for (const edu of resumeData.education) {
          if (edu && typeof edu === "object") {
            // Parse years with validation
            const startYear = edu.startYear
              ? parseInt(edu.startYear)
              : currentYear - 4;
            const endYear = edu.endYear ? parseInt(edu.endYear) : currentYear;

            await prisma.education.create({
              data: {
                userId,
                degree: edu.degree || "Degree",
                institution: edu.institution || "Institution",
                fieldOfStudy: edu.fieldOfStudy || "Unknown Field",
                startYear: isNaN(startYear) ? currentYear - 4 : startYear,
                endYear: isNaN(endYear) ? currentYear : endYear,
              },
            });
          }
        }
      }
    } catch (eduError) {
      console.error("Error updating education:", eduError);
      // Continue if education updates fail
    }

    return true;
  } catch (error: unknown) {
    console.error("Error updating user profile:", error);
    throw new Error(
      `Failed to update user profile: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
