"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login with:", email, password)
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="p-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Sign in</h1>

        {/* Social Login Options */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="relative w-full justify-start border-gray-300 px-4 py-6 text-left"
            onClick={() => console.log("Google login")}
          >
            <div className="flex w-full items-center">
              <div className="mr-3 flex h-6 w-6 items-center justify-center">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </g>
                </svg>
              </div>
              <span>Continue with Google</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="relative w-full justify-start border-gray-300 px-4 py-6 text-left"
            onClick={() => console.log("LinkedIn login")}
          >
            <div className="flex w-full items-center">
              <div className="mr-3 flex h-6 w-6 items-center justify-center text-[#0A66C2]">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span>Sign in with LinkedIn</span>
            </div>
          </Button>
        </div>

        <div className="my-6 flex items-center justify-center">
          <Separator className="w-1/3" />
          <span className="mx-4 text-sm text-gray-500">or</span>
          <Separator className="w-1/3" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Email or phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-gray-300"
              required
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-gray-300 pr-16"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div>
            <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="h-12 w-full bg-blue-600 text-white hover:bg-blue-700">
            Sign in
          </Button>
        </form>
      </div>

      <div className="border-t border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-600">
          New to our platform?{" "}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-800">
            Join now
          </Link>
        </p>
      </div>
    </div>
  )
}

