/*
  Warnings:

  - Added the required column `refName` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EOrderRefName" AS ENUM ('crowdFund', 'flipping', 'property');

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_propertyId_fkey";

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "crowdFundId" TEXT,
ADD COLUMN     "flippingId" TEXT,
ADD COLUMN     "refName" "EOrderRefName" NOT NULL,
ALTER COLUMN "propertyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_crowdFundId_fkey" FOREIGN KEY ("crowdFundId") REFERENCES "CrowdFund"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_flippingId_fkey" FOREIGN KEY ("flippingId") REFERENCES "Flipping"("id") ON DELETE SET NULL ON UPDATE CASCADE;
