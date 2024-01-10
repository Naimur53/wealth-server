/*
  Warnings:

  - The `approvedForSale` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EApprovedForSale" AS ENUM ('pending', 'approved', 'denied');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "approvedForSale",
ADD COLUMN     "approvedForSale" "EApprovedForSale" NOT NULL DEFAULT 'pending';
