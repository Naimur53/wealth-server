/*
  Warnings:

  - You are about to drop the `CrowdFundOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlippingOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyOrders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CrowdFundOrders" DROP CONSTRAINT "CrowdFundOrders_crowdFundId_fkey";

-- DropForeignKey
ALTER TABLE "CrowdFundOrders" DROP CONSTRAINT "CrowdFundOrders_orderById_fkey";

-- DropForeignKey
ALTER TABLE "CrowdFundOrders" DROP CONSTRAINT "CrowdFundOrders_wealthBankId_fkey";

-- DropForeignKey
ALTER TABLE "FlippingOrders" DROP CONSTRAINT "FlippingOrders_flippingId_fkey";

-- DropForeignKey
ALTER TABLE "FlippingOrders" DROP CONSTRAINT "FlippingOrders_orderById_fkey";

-- DropForeignKey
ALTER TABLE "FlippingOrders" DROP CONSTRAINT "FlippingOrders_wealthBankId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyOrders" DROP CONSTRAINT "PropertyOrders_orderById_fkey";

-- DropForeignKey
ALTER TABLE "PropertyOrders" DROP CONSTRAINT "PropertyOrders_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyOrders" DROP CONSTRAINT "PropertyOrders_wealthBankId_fkey";

-- DropTable
DROP TABLE "CrowdFundOrders";

-- DropTable
DROP TABLE "FlippingOrders";

-- DropTable
DROP TABLE "PropertyOrders";

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "paymentReceiptUrl" TEXT,
    "paystackId" TEXT,
    "paystackUrl" TEXT,
    "wealthBankId" TEXT,
    "orderById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EOrderStatus" NOT NULL DEFAULT 'pending',
    "paymentType" "EOrderPaymentType" NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_wealthBankId_fkey" FOREIGN KEY ("wealthBankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
