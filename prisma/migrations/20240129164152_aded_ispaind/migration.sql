/*
  Warnings:

  - You are about to drop the column `isPayedForSeller` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPayedForSeller",
ADD COLUMN     "isPaidForSeller" BOOLEAN;
