/*
  Warnings:

  - You are about to drop the column `verificationToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "verificationToken",
ADD COLUMN     "verification_token" TEXT;
