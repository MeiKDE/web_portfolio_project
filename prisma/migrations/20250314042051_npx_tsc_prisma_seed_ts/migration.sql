-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_identifier_fkey" FOREIGN KEY ("identifier") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
