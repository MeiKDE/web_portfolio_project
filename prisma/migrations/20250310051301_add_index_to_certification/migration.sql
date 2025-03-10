-- DropIndex
DROP INDEX "users_email_key";

-- CreateIndex
CREATE INDEX "Certification_userId_idx" ON "Certification"("userId");
