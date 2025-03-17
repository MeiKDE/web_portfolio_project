-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hasCompletedProfileSetup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUploadResumeForProfile" BOOLEAN NOT NULL DEFAULT false;
