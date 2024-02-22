/*
  Warnings:

  - You are about to drop the column `flipingId` on the `SavedPropertry` table. All the data in the column will be lost.
  - You are about to drop the `Fliping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlipingOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedFliping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fliping" DROP CONSTRAINT "Fliping_locationId_fkey";

-- DropForeignKey
ALTER TABLE "FlipingOrders" DROP CONSTRAINT "FlipingOrders_flipingId_fkey";

-- DropForeignKey
ALTER TABLE "FlipingOrders" DROP CONSTRAINT "FlipingOrders_orderById_fkey";

-- DropForeignKey
ALTER TABLE "FlipingOrders" DROP CONSTRAINT "FlipingOrders_wealthBankId_fkey";

-- DropForeignKey
ALTER TABLE "SavedFliping" DROP CONSTRAINT "SavedFliping_flipingId_fkey";

-- DropForeignKey
ALTER TABLE "SavedFliping" DROP CONSTRAINT "SavedFliping_ownById_fkey";

-- DropForeignKey
ALTER TABLE "SavedPropertry" DROP CONSTRAINT "SavedPropertry_flipingId_fkey";

-- AlterTable
ALTER TABLE "SavedPropertry" DROP COLUMN "flipingId",
ADD COLUMN     "flippingId" TEXT;

-- DropTable
DROP TABLE "Fliping";

-- DropTable
DROP TABLE "FlipingOrders";

-- DropTable
DROP TABLE "SavedFliping";

-- CreateTable
CREATE TABLE "Flipping" (
    "id" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rooms" INTEGER,
    "size" TEXT NOT NULL,
    "floor" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "streetLocation" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "images" TEXT[],
    "type" "EPropertyType" NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Flipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedFlipping" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "flippingId" TEXT NOT NULL,

    CONSTRAINT "SavedFlipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlippingOrders" (
    "id" TEXT NOT NULL,
    "flippingId" TEXT NOT NULL,
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

    CONSTRAINT "FlippingOrders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedFlipping_id_key" ON "SavedFlipping"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FlippingOrders_id_key" ON "FlippingOrders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FlippingOrders_flippingId_key" ON "FlippingOrders"("flippingId");

-- AddForeignKey
ALTER TABLE "SavedPropertry" ADD CONSTRAINT "SavedPropertry_flippingId_fkey" FOREIGN KEY ("flippingId") REFERENCES "Flipping"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flipping" ADD CONSTRAINT "Flipping_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFlipping" ADD CONSTRAINT "SavedFlipping_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFlipping" ADD CONSTRAINT "SavedFlipping_flippingId_fkey" FOREIGN KEY ("flippingId") REFERENCES "Flipping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlippingOrders" ADD CONSTRAINT "FlippingOrders_flippingId_fkey" FOREIGN KEY ("flippingId") REFERENCES "Flipping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlippingOrders" ADD CONSTRAINT "FlippingOrders_wealthBankId_fkey" FOREIGN KEY ("wealthBankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlippingOrders" ADD CONSTRAINT "FlippingOrders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
