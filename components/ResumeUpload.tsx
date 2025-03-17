"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [choice, setChoice] = useState<"upload" | "manual" | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

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

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("resume", file);

      // Upload the file
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      const data = await response.json();

      // Redirect to profile page with parsed data
      router.push("/profile");
    } catch (err) {
      setError("Error uploading resume. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualSetup = () => {
    router.push("/profile");
  };

  if (!session) {
    return null; // Don't show if not logged in
  }

  if (!choice) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Welcome to Your Profile Setup
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
            onClick={() => setChoice("manual")}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >
            Update Manually
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
      <p className="mb-6">
        Upload your resume as a PDF file, and we'll use AI to extract
        information and populate your profile.
      </p>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select PDF Resume</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-between">
        <button
          onClick={() => setChoice(null)}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={handleUpload}
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
    </div>
  );
}
