/*
  Warnings:

  - You are about to drop the column `flippingId` on the `SavedPropertry` table. All the data in the column will be lost.
  - Added the required column `accountName` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavedPropertry" DROP CONSTRAINT "SavedPropertry_flippingId_fkey";

-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "accountName" TEXT NOT NULL,
ADD COLUMN     "accountNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SavedPropertry" DROP COLUMN "flippingId";
