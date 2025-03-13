import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { successResponse } from "@/lib/api-helpers";
import {
  handleApiError,
  createApiError,
  HTTP_STATUS,
} from "@/lib/error-handler";
import { verifyPassword } from "@/lib/auth";

// Define validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      throw createApiError.badRequest(
        "Invalid login data",
        validationResult.error.format()
      );
    }

    const { email, password } = validationResult.data;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.hashedPassword || !user.salt) {
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
    return handleApiError(error, "Login failed", "POST /auth/login");
  }
}
