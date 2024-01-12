-- CreateEnum
CREATE TYPE "EStatusOfCurrencyRequest" AS ENUM ('pending', 'approved', 'denied');

-- AlterTable
ALTER TABLE "currencyRequest" ADD COLUMN     "status" "EStatusOfCurrencyRequest" NOT NULL DEFAULT 'pending';
