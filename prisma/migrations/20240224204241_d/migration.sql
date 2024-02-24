/*
  Warnings:

  - You are about to drop the `PropertryOrders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PropertryOrders" DROP CONSTRAINT "PropertryOrders_orderById_fkey";

-- DropForeignKey
ALTER TABLE "PropertryOrders" DROP CONSTRAINT "PropertryOrders_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertryOrders" DROP CONSTRAINT "PropertryOrders_wealthBankId_fkey";

-- DropTable
DROP TABLE "PropertryOrders";

-- CreateTable
CREATE TABLE "PropertyOrders" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "paymentReceiptUrl" TEXT,
    "paystackId" TEXT,
    "wealthBankId" TEXT,
    "orderById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EOrderStatus" NOT NULL DEFAULT 'pending',
    "paymentType" "EPaymentType" NOT NULL,

    CONSTRAINT "PropertyOrders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyOrders_id_key" ON "PropertyOrders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyOrders_propertyId_key" ON "PropertyOrders"("propertyId");

-- AddForeignKey
ALTER TABLE "PropertyOrders" ADD CONSTRAINT "PropertyOrders_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOrders" ADD CONSTRAINT "PropertyOrders_wealthBankId_fkey" FOREIGN KEY ("wealthBankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyOrders" ADD CONSTRAINT "PropertyOrders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
