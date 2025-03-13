import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { AuthOptions, NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as crypto from "crypto";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { successResponse, errorResponse } from "./api-helpers";

// Add type for the session
interface ExtendedSession extends Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

// Function to hash password using crypto
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
}

// Function to verify password
export function verifyPassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  try {
    const verifyHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return hash === verifyHash;
  } catch (error) {
    console.error("Password verification error:", error);
    console.log("ln45 Password:", password);
    return false;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log(
            "User lookup result:",
            user ? "User found" : "User not found"
          );

          if (!user || !user.hashedPassword || !user.salt) {
            console.log("User not found or missing password data");
            return null;
          }

          // Verify password
          const isValid = verifyPassword(
            credentials.password,
            user.hashedPassword,
            user.salt
          );

          console.log(
            "Password verification result:",
            isValid ? "Valid" : "Invalid"
          );

          if (!isValid) {
            return null;
          }

          console.log("Authentication successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      // Include the provider in the token
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // You can add the provider to the session if needed
        (session as any).provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Make sure we have the required user data
      if (!user.email) {
        return false;
      }

      try {
        // If using adapter, you might not need additional logic here
        // as the adapter should handle account creation
        return true;
      } catch (error) {
        console.error("OAuth sign-in error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Fix the URL validation logic
      if (url.startsWith("/")) {
        // For relative URLs, prepend the base URL
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        // If it already has the base URL, return as is
        return url;
      }
      // Default to the base URL for all other cases
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", // Create a custom error page
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

// Make sure to export the config as default as well
export default authOptions;

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      title: true,
      location: true,
      phone: true,
      bio: true,
    },
  });

  return user;
}

// Verify if a token is valid
export async function verifyToken(accessToken: string) {
  try {
    // Check if the token exists in the database and is not expired
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: accessToken,
        expires: {
          gt: new Date(),
        },
      },
    });

    return !!session;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}

export async function withAuthApi(
  handler: (req: NextRequest, user: any) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    return handler(req, user);
  };
}
