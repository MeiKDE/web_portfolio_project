-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" DROP DEFAULT;
