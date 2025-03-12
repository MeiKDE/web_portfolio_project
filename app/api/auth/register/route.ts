import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";

// Define validation schema for registration
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Function to hash password using crypto
function hashPassword(password: string): {
  salt: string;
  hashedPassword: string;
} {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return { salt, hashedPassword };
}

// Function to verify password
export function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): boolean {
  const [salt, hash] = storedPassword.split(":");
  const suppliedHash = crypto
    .pbkdf2Sync(suppliedPassword, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === suppliedHash;
}

// Password validation function
const validatePassword = (password: string) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  return Object.values(requirements).every(Boolean);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Check password validation
    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters",
        },
        { status: 400 }
      );
    }

    // Generate salt and hash password
    const { salt, hashedPassword } = hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        salt,
        title: "New User", // Default value
        location: "Not specified", // Default value
        bio: "No bio provided", // Default value
      },
    });

    // Remove sensitive data from response
    const { hashedPassword: _, salt: __, ...userWithoutSensitiveData } = user;

    return NextResponse.json({
      message: "User registered successfully",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
