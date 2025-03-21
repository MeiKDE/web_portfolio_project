"use client";
import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ResumeData = {
  name?: string;
  profile_email?: string;
  phone?: string;
  title?: string;
  location?: string;
  bio?: string;
  workExperience?: Array<{
    position?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    isCurrentPosition?: boolean;
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
  }>;
  skills?: string[];
};

function toTitleCase(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Add a new prop to track if we're coming from profile page
interface ResumeUploadProps {
  fromProfile?: boolean;
  onClose?: () => void;
}

export default function ResumeUpload({
  fromProfile = false,
  onClose,
}: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [choice, setChoice] = useState<"upload" | "manual" | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState<ResumeData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file");
    }
  };

  const handleUpload = async (file: File) => {
    console.log("ln75: Starting upload...");
    try {
      setIsUploading(true);
      setError("");

      // Create form data for the file
      const formData = new FormData();
      formData.append("resume", file);

      console.log("Starting resume upload...");
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      console.log("ln89: Upload response status:", response.status);

      const data = await response.json();
      console.log("ln92: Upload response data:", data);

      if (!response.ok) {
        console.error("Upload error details:", data);
        throw new Error(
          `PDF processing error: ${data.message || "Unknown error"}`
        );
      }

      setIsUploading(false);
      setSuccess(true);

      // Store the profile data for display
      if (data.data && data.data.resumeData) {
        console.log("ln105: Setting profile data:", data.data.resumeData);
        setProfileData(data.data.resumeData);

        // Automatically save the profile data without requiring user confirmation
        if (fromProfile) {
          console.log("ln115: Automatically saving profile data...");
          const saved = await saveProfileData(data.data.resumeData);
          return;
        }
      } else {
        console.log("ln123 No resume data found in response");
        // If no profile data, redirect to profile page
        if (fromProfile) {
          if (onClose) {
            onClose();
          } else {
            router.push("/profile?updated=true");
          }
          return;
        }
      }
    } catch (error: unknown) {
      console.error("Resume upload failed:", error);
      setIsUploading(false);
      setError(
        error instanceof Error ? error.message : "Failed to upload resume"
      );
    }
  };

  const saveProfileData = async (profileData: ResumeData) => {
    try {
      console.log("ln149: Automatically saving profile data...");
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileData }),
      });

      console.log("Save response status:", response.status);
      const data = await response.json();
      console.log("Save response data:", data);

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      console.log("Profile saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      return false;
    }
  };

  const handleManualSetup = () => {
    if (fromProfile && onClose) {
      onClose();
    } else {
      // Use a special query parameter to trigger a refresh
      router.push("/profile?updated=true");
    }
  };

  const renderProfilePreview = () => {
    console.log("ln184: Rendering profile preview...");
    console.log("ln185: Profile data:", profileData);
    if (!profileData) return null;
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-bold mb-4">Profile Preview</h3>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-4">
              {profileData.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {toTitleCase(profileData.name)}
              </h2>
              <p className="text-gray-600">{toTitleCase(profileData.title)}</p>
              <p className="text-gray-500">
                {toTitleCase(profileData.location)}
              </p>
            </div>
          </div>

          {profileData.bio && (
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">About</h4>
              <p className="text-gray-700">{profileData.bio}</p>
            </div>
          )}
        </div>

        {profileData.workExperience &&
          profileData.workExperience.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Work Experience</h4>
              {profileData.workExperience.map((exp, index) => (
                <div
                  key={index}
                  className="mb-4 border-l-2 border-blue-500 pl-4"
                >
                  <div className="flex justify-between">
                    <h5 className="font-medium">{exp.position}</h5>
                    <span className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-gray-500 text-sm">{exp.location}</p>
                  {exp.description && (
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

        {profileData.education && profileData.education.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Education</h4>
            {profileData.education.map((edu, index) => (
              <div
                key={index}
                className="mb-4 border-l-2 border-green-500 pl-4"
              >
                <div className="flex justify-between">
                  <h5 className="font-medium">{edu.degree}</h5>
                  <span className="text-sm text-gray-500">
                    {edu.startYear} - {edu.endYear}
                  </span>
                </div>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-gray-600">{edu.fieldOfStudy}</p>
                {edu.description && (
                  <p className="text-gray-700 mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {profileData.skills && profileData.skills.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={saveProfileAndRedirect}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 mr-4"
          >
            Keep This As My Profile
          </button>

          <button
            onClick={() => {
              // Simply redirect to the profile page for manual editing
              // The data is already saved in the database
              if (fromProfile && onClose) {
                onClose();
              } else {
                router.push("/profile?updated=true");
              }
            }}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300"
          >
            Update My Profile Manually
          </button>
        </div>
      </div>
    );
  };

  const saveProfileAndRedirect = async () => {
    try {
      console.log("ln308: Saving profile data...");
      const saved = await saveProfileData(profileData!);

      if (saved) {
        console.log("ln312: Profile data saved successfully");
        // Use onClose if coming from profile page, otherwise redirect
        if (fromProfile && onClose) {
          console.log("ln314: Calling onClose...");
          onClose();
        } else {
          // Add a query parameter to force a refresh of the profile page
          console.log("ln318: Pushing to profile page with updated=true");
          router.push("/profile?updated=true");
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      // Still try to return to profile page even if there's an error
      if (fromProfile && onClose) {
        onClose();
      } else {
        console.log("ln329: Pushing to profile page with updated=true");
        router.push("/profile?updated=true");
      }
    }
  };

  if (!session) {
    return null; // Don't show if not logged in
  }

  if (!choice) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">
          {fromProfile ? "Upload Resume" : "Welcome to Your Profile Setup"}
        </h2>
        <p className="mb-6">
          Would you like to upload your resume as a PDF to populate your profile
          content, or would you prefer to update your profile manually?
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => setChoice("upload")}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Upload Resume PDF
          </button>
          <button
            onClick={() => {
              if (fromProfile && onClose) {
                onClose();
              } else {
                setChoice("manual");
              }
            }}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >
            {fromProfile ? "Return to Profile" : "Update Manually"}
          </button>
        </div>
      </div>
    );
  }

  if (choice === "manual") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Manual Profile Setup</h2>
        <p className="mb-6">
          You'll be redirected to the profile page to fill in your information
          manually.
        </p>
        <button
          onClick={handleManualSetup}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Continue to Profile
        </button>
      </div>
    );
  }
  console.log("ln391: Check success && profileData", success, profileData);
  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Only show upload section if we haven't successfully uploaded */}
      {!success && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
          <p className="mb-6">
            Upload your resume as a PDF file, and we'll use AI to extract
            information and populate your profile.
          </p>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Select PDF Resume
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {error && (
            <div className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
              {error.includes("parse") && (
                <p className="mt-2 text-sm">
                  Our system couldn't properly read your resume. This might be
                  due to formatting or the PDF structure. You can try a
                  different PDF or continue with manual setup.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setChoice(null)}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={() => file && handleUpload(file)}
              disabled={!file || isUploading}
              className={`bg-blue-600 text-white py-2 px-4 rounded ${
                !file || isUploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload and Parse Resume"}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-center">
              <button
                onClick={handleManualSetup}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Continue with manual setup instead
              </button>
            </div>
          )}
        </div>
      )}

      {/* Show profile preview if we have data */}
      {success && profileData && renderProfilePreview()}
    </div>
  );
}
