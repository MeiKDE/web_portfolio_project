import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-prisma-client-dev-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// Only test connection during actual server startup, not during hot reloads
if (process.env.NODE_ENV === "production") {
  try {
    // Test database connection on startup
    prisma.$connect();
    console.log("Database connection established");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
}
