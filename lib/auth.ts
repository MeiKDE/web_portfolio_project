import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prismaClient = new PrismaClient();

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === verifyHash;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prismaClient.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword || !user.salt) {
          return null;
        }

        const isValid = verifyPassword(
          credentials.password,
          user.hashedPassword,
          user.salt
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Make sure to export the config as default as well
export default authOptions;

// Get the current user from the session
export async function getCurrentUser() {
  try {
    const accessToken = cookies().get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // Find the session
    const session = await prisma.session.findFirst({
      where: {
        accessToken,
        expiresAt: {
          gt: new Date(), // Session hasn't expired
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    // Return the user without the password
    const { password, ...userWithoutPassword } = session.user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Verify if a token is valid
export async function verifyToken(accessToken: string) {
  try {
    // Check if the token exists in the database and is not expired
    const session = await prisma.session.findFirst({
      where: {
        accessToken,
        expiresAt: {
          gt: new Date(), // Session hasn't expired
        },
      },
    });

    return !!session; // Return true if session exists, false otherwise
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}
