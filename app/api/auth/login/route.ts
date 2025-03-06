import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import * as crypto from "crypto";

// Define validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Function to verify password
function verifyPassword(
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
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password using our custom function
    const isPasswordValid = verifyPassword(user.password, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate access token
    const accessToken = uuidv4();

    // Set expiration date (e.g., 7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        accessToken,
        expiresAt,
      },
    });

    // Set cookie
    cookies().set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      path: "/",
      expires: expiresAt,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
