import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import {
  handleApiError,
  createApiError,
  HTTP_STATUS,
} from "@/lib/error-handler";
import { hashPassword } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

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

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, password, name } = data;

    // Basic validation
    if (!email || !password || !name) {
      return errorResponse(400, "Missing required fields");
    }

    // Find existing user by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });

    if (existingUser) {
      // If user exists but doesn't have credentials
      const hasCredentials = existingUser.hashedPassword && existingUser.salt;

      if (hasCredentials) {
        return errorResponse(400, "Credentials already exist for this email");
      }

      // Hash the password
      const { hash: hashedPassword, salt } = hashPassword(password);

      // Update existing user with credentials
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          hashedPassword,
          salt,
          name: name,
          // Don't update the email field as it's used for authentication
          // If there's a resume email, store it in profile_email
          ...(data.resumeEmail ? { profile_email: data.resumeEmail } : {}),
        },
      });

      return successResponse({
        message: "Credentials added successfully",
      });
    }

    // If no user exists, create new user with credentials
    const { hash: hashedPassword, salt } = hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        salt,
        provider: "CREDENTIALS",
        title: "New User",
        location: "Not specified",
        bio: "",
        // If there's a resume email that's different from the auth email, store it
        ...(data.resumeEmail && data.resumeEmail !== email
          ? { profile_email: data.resumeEmail }
          : {}),
      },
    });

    // After user creation
    const verificationToken = await generateVerificationToken(email);
    console.log("Generated verification token:", {
      email,
      token: verificationToken.token,
      expires: verificationToken.expires,
    });

    await sendVerificationEmail(email, verificationToken.token);

    // Check the database directly after creation
    const savedToken = await prisma.verificationToken.findUnique({
      where: { token: verificationToken.token },
    });
    console.log("Saved token in database:", savedToken);

    return successResponse(
      "Registration successful. Please check your email for verification."
    );
  } catch (error) {
    // Add logging here to catch any email sending errors
    console.error("Registration error:", error);
    return errorResponse(500, "Error creating user");
  }
}
