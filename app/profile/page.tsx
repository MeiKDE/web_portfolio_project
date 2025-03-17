import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/user-service";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const userProfile = await getUserProfile(session.user.id);

  // If user hasn't completed profile setup, redirect to homepage
  if (!userProfile?.hasCompletedProfileSetup) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      {userProfile.isUploadResumeForProfile && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>
            Your profile has been populated from your resume. Feel free to make
            any adjustments needed.
          </p>
        </div>
      )}

      {/* Display profile information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <p>
          <strong>Name:</strong> {userProfile.name}
        </p>
        <p>
          <strong>Email:</strong> {userProfile.profile_email}
        </p>
        <p>
          <strong>Phone:</strong> {userProfile.phone}
        </p>
        <p>
          <strong>Location:</strong> {userProfile.location}
        </p>
        <p>
          <strong>Title:</strong> {userProfile.title}
        </p>
        <p>
          <strong>Bio:</strong> {userProfile.bio}
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
        {userProfile.experiences.map((exp) => (
          <div key={exp.id} className="mb-4 pb-4 border-b">
            <h3 className="font-semibold">
              {exp.position} at {exp.company}
            </h3>
            <p className="text-sm text-gray-600">
              {new Date(exp.startDate).toLocaleDateString()} -
              {exp.endDate
                ? new Date(exp.endDate).toLocaleDateString()
                : "Present"}
            </p>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        {userProfile.education.map((edu) => (
          <div key={edu.id} className="mb-4 pb-4 border-b">
            <h3 className="font-semibold">
              {edu.degree} in {edu.fieldOfStudy}
            </h3>
            <p className="text-sm text-gray-600">
              {edu.institution}, {edu.startYear} - {edu.endYear}
            </p>
            <p>{edu.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {userProfile.skills.map((skill) => (
            <span
              key={skill.id}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Add form for editing profile data */}
      {/* ... */}
    </div>
  );
}
