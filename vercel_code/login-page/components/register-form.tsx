"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Register with:", { email, password, rememberMe })
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg bg-white p-8 shadow-lg">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Make the most of your professional life</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
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
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label htmlFor="remember" className="text-sm font-medium leading-none text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-xs text-gray-600">
            By clicking Agree & Join or Continue, you agree to the LinkedIn{" "}
            <Link href="/user-agreement" className="text-blue-600 hover:underline">
              User Agreement
            </Link>
            ,{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/cookie-policy" className="text-blue-600 hover:underline">
              Cookie Policy
            </Link>
            .
          </div>

          <Button type="submit" className="h-12 w-full bg-blue-600 text-white hover:bg-blue-700">
            Agree & Join
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <Separator className="w-1/3" />
          <span className="mx-4 text-sm text-gray-500">or</span>
          <Separator className="w-1/3" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="relative h-12 w-full justify-start border-gray-300 px-4"
          onClick={() => console.log("Google sign in")}
        >
          <div className="flex w-full items-center justify-center">
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

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already on LinkedIn?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Looking to create a page for a business?{" "}
            <Link href="/help" className="font-medium text-blue-600 hover:text-blue-800">
              Get help
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

