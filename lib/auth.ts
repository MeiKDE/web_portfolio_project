import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { AuthOptions, NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as crypto from "crypto";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

// Add type for the session
interface ExtendedSession extends Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === verifyHash;
}

export const authOptions: NextAuthOptions = {
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

        const user = await prisma.user.findUnique({
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
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
    const { hashedPassword, salt, ...userWithoutSensitiveData } = session.user;
    return userWithoutSensitiveData;
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
