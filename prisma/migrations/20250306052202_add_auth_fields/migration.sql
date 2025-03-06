-- First, create the enum type
CREATE TYPE "AuthProvider" AS ENUM ('CREDENTIALS', 'GOOGLE', 'LINKEDIN');

-- Then alter the table to use it
ALTER TABLE "User" ADD COLUMN "email" TEXT NOT NULL DEFAULT 'default@example.com',
ADD COLUMN "password" TEXT,
ADD COLUMN "provider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIALS',
ADD COLUMN "providerId" TEXT;

-- After adding the column with a default value, update existing records with unique emails
UPDATE "User" SET "email" = CONCAT('user_', id, '@example.com') WHERE email = 'default@example.com';

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_accessToken_key" ON "Session"("accessToken");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; 