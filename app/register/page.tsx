"use client";

import RegisterForm from "@/app/components/auth/RegisterForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Show success message instead of immediate redirect
      setIsRegistered(true);
      setError("");
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred");
    }
  };

  if (isRegistered) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Registration Successful!
          </h2>
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Please check your email to verify your account. We have sent you a
              verification link.
            </p>
            <p className="text-sm">
              If you don't see the email, please check your spam folder.
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <RegisterForm onSubmit={handleSubmit} error={error} />
    </main>
  );
}
