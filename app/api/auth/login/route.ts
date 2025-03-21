import { NextRequest } from "next/server";
import prisma from "@/app/lib/db/prisma";
import { z } from "zod";
import { successResponse, validateRequest } from "@/app/lib/api/api-helpers";
import {
  handleApiError,
  createApiError,
  HTTP_STATUS,
} from "@/app/lib/api/error-handler";
import { verifyPassword } from "@/app/lib/auth/crypto-utils";

// Define validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Validate input data using the helper
    const { email, password } = await validateRequest(request, loginSchema);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createApiError.unauthorized("Invalid email or password");
    }

    if (!user.hashedPassword || !user.salt) {
      throw createApiError.unauthorized("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = verifyPassword(
      password,
      user.hashedPassword,
      user.salt
    );

    if (!isPasswordValid) {
      throw createApiError.unauthorized("Invalid email or password");
    }

    // Return user data without sensitive information
    const userWithoutSensitiveData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    return successResponse({
      message: "Login successful",
      user: userWithoutSensitiveData,
    });
  } catch (error) {
    return handleApiError("Login failed");
  }
}
