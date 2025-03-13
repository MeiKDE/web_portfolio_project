"use client";

import RegisterForm from "@/components/register-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

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

      // Redirect to login page on success
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <RegisterForm onSubmit={handleSubmit} error={error} />
    </main>
  );
}
