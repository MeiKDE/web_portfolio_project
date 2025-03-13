import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { successResponse } from "@/lib/api-helpers";
import {
  handleApiError,
  createApiError,
  HTTP_STATUS,
} from "@/lib/error-handler";
import { hashPassword } from "@/lib/auth";

// Define validation schema for registration
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
  title: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

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

    const { name, email, password, title, location, bio } =
      validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createApiError.conflict("User with this email already exists");
    }

    // Hash the password using crypto
    const { hash, salt } = hashPassword(password);

    // Create the user with required fields
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hash,
        salt: salt,
        title: title || "Professional",
        location: location || "Not specified",
        bio: bio || "No bio provided",
        provider: "CREDENTIALS",
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
