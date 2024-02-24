/*
  Warnings:

  - You are about to drop the column `tragetFund` on the `CrowdFund` table. All the data in the column will be lost.
  - Added the required column `targetFund` to the `CrowdFund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CrowdFund" DROP COLUMN "tragetFund",
ADD COLUMN     "targetFund" DOUBLE PRECISION NOT NULL;
