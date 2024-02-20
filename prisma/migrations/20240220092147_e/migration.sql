-- CreateEnum
CREATE TYPE "EOrderStatus" AS ENUM ('pending', 'success', 'denied');

-- CreateEnum
CREATE TYPE "EPaymentType" AS ENUM ('paystack', 'manual');

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "paymentReceiptUrl" TEXT,
    "orderById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EOrderStatus" NOT NULL DEFAULT 'pending',
    "paymentType" "EPaymentType" NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_propertyId_key" ON "Orders"("propertyId");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
