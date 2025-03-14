import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-prisma-client-dev-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = new PrismaClient();

export default prisma;

// Add error handling to your Prisma client
try {
  // Test database connection on startup
  prisma.$connect();
  console.log("Database connection established");
} catch (error) {
  console.error("Failed to connect to database:", error);
}
