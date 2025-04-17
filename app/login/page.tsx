"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const verified = searchParams.get("verified");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(error || "");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Clear search param errors when component mounts
  useEffect(() => {
    if (error) {
      console.log("Error from URL:", error);
      // Handle specific error codes from NextAuth
      if (error === "CredentialsSignin") {
        setLoginError(
          "Login failed. Please check if your account exists and your credentials are correct."
        );
      } else {
        setLoginError(error);
      }
    }
  }, [error]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError(
        "Please enter a valid email address (e.g., user@example.com)"
      );
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordCriteria(criteria);

    if (!password) {
      setPasswordError("Password is required");
      return false;
    }

    // Check if all criteria are met
    const allCriteriaMet = Object.values(criteria).every(
      (value) => value === true
    );

    if (!allCriteriaMet) {
      setPasswordError("Password does not meet security requirements");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error codes from NextAuth
        if (
          result.error === "CredentialsSignin" ||
          result.error === "User not found or missing password data"
        ) {
          setLoginError(
            "No account found with this email address. Please check your email or register for a new account."
          );
        } else if (result.error.includes("Invalid password")) {
          setLoginError("Incorrect password. Please try again.");
        } else {
          setLoginError(result.error);
        }
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setLoginError("An error occurred during login");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  // Update the renderAccountNotFoundMessage function to handle different error types
  const renderErrorHelperMessage = () => {
    //console.log("Current login error:", loginError);

    if (!loginError) return null;

    if (
      loginError.includes("No account found") ||
      loginError.includes("Login failed") ||
      loginError.includes("account exists")
    ) {
      return (
        <div className="mt-2 text-sm">
          <span>This account doesn't exist. </span>
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Register here
          </Link>
        </div>
      );
    } else if (loginError.includes("Incorrect password")) {
      return (
        <div className="mt-2 text-sm">
          <span>Please double-check your password and try again. </span>
          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Forgot password?
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      {verified && (
        <div className="absolute top-4 w-full max-w-md rounded-md bg-green-100 p-4 text-green-700">
          Your email has been verified successfully! Please log in.
        </div>
      )}
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {loginError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">{loginError}</p>
            {renderErrorHelperMessage()}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FcGoogle className="h-5 w-5" />
          Sign in with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
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
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                className={`mt-1 block w-full rounded-md border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                placeholder="Email address"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter a valid email address (e.g., user@example.com)
              </p>
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
                required
                value={password}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setPassword(newPassword);
                  validatePassword(newPassword);
                  if (passwordError) validatePassword(newPassword);
                }}
                onBlur={() => validatePassword(password)}
                onFocus={() => setShowPasswordRequirements(true)}
                className={`mt-1 block w-full rounded-md border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                placeholder="Password"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
              {showPasswordRequirements && (
                <div className="mt-1 text-xs text-gray-500">
                  <p>Enter your password to sign in</p>
                  <div className="mt-1">
                    <p className="font-medium mb-1">
                      A secure password should have:
                    </p>
                    <ul className="list-none pl-1 space-y-1">
                      <li className="flex items-center">
                        <span
                          className={`mr-2 ${
                            passwordCriteria.length
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordCriteria.length ? "✓" : "○"}
                        </span>
                        At least 8 characters
                      </li>
                      <li className="flex items-center">
                        <span
                          className={`mr-2 ${
                            passwordCriteria.uppercase
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordCriteria.uppercase ? "✓" : "○"}
                        </span>
                        Uppercase letters
                      </li>
                      <li className="flex items-center">
                        <span
                          className={`mr-2 ${
                            passwordCriteria.lowercase
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordCriteria.lowercase ? "✓" : "○"}
                        </span>
                        Lowercase letters
                      </li>
                      <li className="flex items-center">
                        <span
                          className={`mr-2 ${
                            passwordCriteria.number
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordCriteria.number ? "✓" : "○"}
                        </span>
                        At least one number
                      </li>
                      <li className="flex items-center">
                        <span
                          className={`mr-2 ${
                            passwordCriteria.special
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordCriteria.special ? "✓" : "○"}
                        </span>
                        At least one special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                  <p className="mt-2">
                    Forgot your password?{" "}
                    <Link
                      href="/forgot-password"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Reset it here
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
