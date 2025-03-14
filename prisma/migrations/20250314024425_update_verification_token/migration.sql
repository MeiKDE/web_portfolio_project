/*
  Warnings:

  - You are about to drop the column `verification_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "verification_token",
ADD COLUMN     "verificationToken" TEXT;
