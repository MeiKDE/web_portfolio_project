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
  const [success, setSuccess] = useState(false);

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
    try {
      setIsUploading(true);
      setError("");

      // Create form data for the file
      const formData = new FormData();
      formData.append("resume", file);

      console.log("Uploading resume PDF...");
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      console.log("ln41 Check Response:", response);

      const data = await response.json();

      console.log("ln43 Check Data:", data);

      if (!response.ok) {
        console.error("Upload error details:", data);
        throw new Error(
          `PDF processing error: ${data.message || "Unknown error"}`
        );
      }

      setIsUploading(false);
      setSuccess(true);
      // Optionally redirect to profile page after successful upload
      // router.push("/profile");
    } catch (error: unknown) {
      console.error("Resume upload failed:", error);
      setIsUploading(false);
      setError(
        error instanceof Error ? error.message : "Failed to upload resume"
      );
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

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          {error.includes("parse") && (
            <p className="mt-2 text-sm">
              Our system couldn't properly read your resume. This might be due
              to formatting or the PDF structure. You can try a different PDF or
              continue with manual setup.
            </p>
          )}
        </div>
      )}

      {success && (
        <p className="text-green-500 mb-4 p-3 bg-green-50 border border-green-200 rounded">
          Resume uploaded and parsed successfully!
          <button
            onClick={() => router.push("/profile")}
            className="ml-2 underline text-blue-600 hover:text-blue-800"
          >
            View your profile
          </button>
        </p>
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
  );
}
