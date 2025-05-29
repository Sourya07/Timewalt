-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verifytoken" DROP NOT NULL,
ALTER COLUMN "verifytokenExpiry" DROP NOT NULL,
ALTER COLUMN "forgetPasswordToken" DROP NOT NULL,
ALTER COLUMN "forgetPasswordTokenExpiry" DROP NOT NULL;
