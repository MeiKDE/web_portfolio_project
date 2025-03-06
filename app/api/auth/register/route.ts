import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import * as crypto from "crypto";

// Define simplified validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Function to hash password using Node.js crypto
function hashPassword(password: string): string {
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString("hex");
  // Hash the password with the salt using PBKDF2
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  // Return the salt and hash combined
  return `${salt}:${hash}`;
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
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password using our custom function
    const hashedPassword = hashPassword(password);

    // Create user with default values for required fields
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        title: "New User", // Default value
        location: "Not specified", // Default value
        bio: "No bio provided", // Default value
        provider: "CREDENTIALS",
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
