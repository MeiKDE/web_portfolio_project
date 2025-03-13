import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";
import { successResponse } from "@/lib/api-helpers";
import {
  handleApiError,
  createApiError,
  HTTP_STATUS,
} from "@/lib/error-handler";

// Define validation schema for registration
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Function to hash password using crypto
function hashPassword(password: string): string {
  // Use a secure hashing algorithm with salt
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
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

    // Validate input data
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      throw createApiError.badRequest(
        "Invalid registration data",
        validationResult.error.format()
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createApiError.conflict("User with this email already exists");
    }

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove sensitive data before returning
    const userWithoutSensitiveData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return successResponse(
      {
        message: "User registered successfully",
        user: userWithoutSensitiveData,
      },
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    return handleApiError(error, "Registration failed", "POST /auth/register");
  }
}
