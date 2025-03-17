-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profile_email" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
