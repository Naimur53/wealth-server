/*
  Warnings:

  - You are about to drop the `currencyRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "currencyRequest" DROP CONSTRAINT "currencyRequest_ownById_fkey";

-- DropTable
DROP TABLE "currencyRequest";

-- CreateTable
CREATE TABLE "CurrencyRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "ownById" TEXT NOT NULL,
    "status" "EStatusOfCurrencyRequest" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrencyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyRequest_id_key" ON "CurrencyRequest"("id");

-- AddForeignKey
ALTER TABLE "CurrencyRequest" ADD CONSTRAINT "CurrencyRequest_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
