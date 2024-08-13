-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetTokenExpiresAt" TIMESTAMP(3);
