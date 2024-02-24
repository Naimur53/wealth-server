/*
  Warnings:

  - Changed the type of `paymentType` on the `CrowdFundOrders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentType` on the `FlippingOrders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentType` on the `PropertyOrders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EOrderPaymentType" AS ENUM ('paystack', 'manual');

-- AlterTable
ALTER TABLE "CrowdFundOrders" DROP COLUMN "paymentType",
ADD COLUMN     "paymentType" "EOrderPaymentType" NOT NULL;

-- AlterTable
ALTER TABLE "FlippingOrders" DROP COLUMN "paymentType",
ADD COLUMN     "paymentType" "EOrderPaymentType" NOT NULL;

-- AlterTable
ALTER TABLE "PropertyOrders" ADD COLUMN     "paystackUrl" TEXT,
DROP COLUMN "paymentType",
ADD COLUMN     "paymentType" "EOrderPaymentType" NOT NULL;

-- DropEnum
DROP TYPE "EPaymentType";
