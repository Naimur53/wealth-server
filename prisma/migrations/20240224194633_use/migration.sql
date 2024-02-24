/*
  Warnings:

  - You are about to drop the column `champion` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "champion",
ADD COLUMN     "isChampion" BOOLEAN NOT NULL DEFAULT false;
