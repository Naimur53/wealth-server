/*
  Warnings:

  - The `rooms` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `annualisedReturn` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EUserGender" AS ENUM ('male', 'female', 'transgender', 'others');

-- CreateEnum
CREATE TYPE "EPropertySoldStatus" AS ENUM ('sold', 'available');

-- CreateEnum
CREATE TYPE "EPropertyType" AS ENUM ('land', 'semiDetachedHouse', 'detachedHouse', 'finished', 'unFinished');

-- CreateEnum
CREATE TYPE "EBankType" AS ENUM ('usd', 'naira');

-- CreateEnum
CREATE TYPE "EChatGroupType" AS ENUM ('public', 'private');

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_orderById_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_propertyId_fkey";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "type" "EPropertyType" NOT NULL,
DROP COLUMN "rooms",
ADD COLUMN     "rooms" INTEGER,
ALTER COLUMN "floor" DROP NOT NULL,
DROP COLUMN "annualisedReturn",
ADD COLUMN     "annualisedReturn" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBath" TIMESTAMP(3),
ADD COLUMN     "gender" "EUserGender",
ADD COLUMN     "location" TEXT;

-- DropTable
DROP TABLE "Orders";

-- CreateTable
CREATE TABLE "SavedPropertry" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "flipingId" TEXT,

    CONSTRAINT "SavedPropertry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertryOrders" (
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

    CONSTRAINT "PropertryOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "typeOfBank" "EBankType" NOT NULL,
    "logoOfBank" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrowdFund" (
    "id" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rooms" INTEGER,
    "size" TEXT NOT NULL,
    "floor" TEXT,
    "tragetFund" DOUBLE PRECISION NOT NULL,
    "fundRaised" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "streetLocation" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "type" "EPropertyType" NOT NULL,
    "images" TEXT[],
    "locationId" TEXT NOT NULL,

    CONSTRAINT "CrowdFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCrowdFund" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "crowdFundId" TEXT NOT NULL,

    CONSTRAINT "SavedCrowdFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrowdFundOrders" (
    "id" TEXT NOT NULL,
    "crowdFundId" TEXT NOT NULL,
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

    CONSTRAINT "CrowdFundOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fliping" (
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

    CONSTRAINT "Fliping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedFliping" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "flipingId" TEXT NOT NULL,

    CONSTRAINT "SavedFliping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlipingOrders" (
    "id" TEXT NOT NULL,
    "flipingId" TEXT NOT NULL,
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

    CONSTRAINT "FlipingOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL,
    "ownById" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatGroup" (
    "id" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EChatGroupType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messaage" (
    "id" TEXT NOT NULL,
    "chatGroupId" TEXT NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "sendById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messaage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeenMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "seenById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeenMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedPropertry_id_key" ON "SavedPropertry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertryOrders_id_key" ON "PropertryOrders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PropertryOrders_propertyId_key" ON "PropertryOrders"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_id_key" ON "Bank"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCrowdFund_id_key" ON "SavedCrowdFund"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CrowdFundOrders_id_key" ON "CrowdFundOrders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SavedFliping_id_key" ON "SavedFliping"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FlipingOrders_id_key" ON "FlipingOrders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FlipingOrders_flipingId_key" ON "FlipingOrders"("flipingId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_id_key" ON "Feedback"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatGroup_id_key" ON "ChatGroup"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Messaage_id_key" ON "Messaage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SeenMessage_id_key" ON "SeenMessage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SeenMessage_seenById_key" ON "SeenMessage"("seenById");

-- AddForeignKey
ALTER TABLE "SavedPropertry" ADD CONSTRAINT "SavedPropertry_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPropertry" ADD CONSTRAINT "SavedPropertry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPropertry" ADD CONSTRAINT "SavedPropertry_flipingId_fkey" FOREIGN KEY ("flipingId") REFERENCES "Fliping"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertryOrders" ADD CONSTRAINT "PropertryOrders_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertryOrders" ADD CONSTRAINT "PropertryOrders_wealthBankId_fkey" FOREIGN KEY ("wealthBankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertryOrders" ADD CONSTRAINT "PropertryOrders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCrowdFund" ADD CONSTRAINT "SavedCrowdFund_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCrowdFund" ADD CONSTRAINT "SavedCrowdFund_crowdFundId_fkey" FOREIGN KEY ("crowdFundId") REFERENCES "CrowdFund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrowdFundOrders" ADD CONSTRAINT "CrowdFundOrders_crowdFundId_fkey" FOREIGN KEY ("crowdFundId") REFERENCES "CrowdFund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrowdFundOrders" ADD CONSTRAINT "CrowdFundOrders_wealthBankId_fkey" FOREIGN KEY ("wealthBankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrowdFundOrders" ADD CONSTRAINT "CrowdFundOrders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fliping" ADD CONSTRAINT "Fliping_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFliping" ADD CONSTRAINT "SavedFliping_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFliping" ADD CONSTRAINT "SavedFliping_flipingId_fkey" FOREIGN KEY ("flipingId") REFERENCES "Fliping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlipingOrders" ADD CONSTRAINT "FlipingOrders_flipingId_fkey" FOREIGN KEY ("flipingId") REFERENCES "Fliping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlipingOrders" ADD CONSTRAINT "FlipingOrders_wealthBankId_fkey" FOREIGN KEY ("wealthBankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlipingOrders" ADD CONSTRAINT "FlipingOrders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messaage" ADD CONSTRAINT "Messaage_chatGroupId_fkey" FOREIGN KEY ("chatGroupId") REFERENCES "ChatGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messaage" ADD CONSTRAINT "Messaage_sendById_fkey" FOREIGN KEY ("sendById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenMessage" ADD CONSTRAINT "SeenMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Messaage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenMessage" ADD CONSTRAINT "SeenMessage_seenById_fkey" FOREIGN KEY ("seenById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
