-- CreateEnum
CREATE TYPE "EStatusOfWithdrawalRequest" AS ENUM ('pending', 'approved', 'denied');

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "ownById" TEXT NOT NULL,
    "status" "EStatusOfCurrencyRequest" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalRequest_id_key" ON "WithdrawalRequest"("id");

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
