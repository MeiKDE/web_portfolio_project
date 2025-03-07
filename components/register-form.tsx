"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Add password validation function
  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password before submission
    const { isValid, requirements } = validatePassword(formData.password);
    if (!isValid) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);

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
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to login page on successful registration
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Check password strength as user types
  const passwordCheck = validatePassword(formData.password);

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="mt-2 text-gray-600">Join our professional network</p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Password requirements checklist */}
          <div className="mt-2 text-sm space-y-1">
            <p className="font-medium text-gray-700">Password must contain:</p>
            <ul className="space-y-1 text-gray-600">
              <li
                className={
                  passwordCheck.requirements.length
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                ✓ At least 8 characters
              </li>
              <li
                className={
                  passwordCheck.requirements.uppercase
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                ✓ At least one uppercase letter
              </li>
              <li
                className={
                  passwordCheck.requirements.lowercase
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                ✓ At least one lowercase letter
              </li>
              <li
                className={
                  passwordCheck.requirements.number
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                ✓ At least one number
              </li>
              <li
                className={
                  passwordCheck.requirements.special
                    ? "text-green-600"
                    : "text-gray-600"
                }
              >
                ✓ At least one special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
