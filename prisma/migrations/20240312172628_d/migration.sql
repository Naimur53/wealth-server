/*
  Warnings:

  - You are about to drop the column `DATE_FORMAT(time, '%Y-%m')` on the `PropertyState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PropertyState" DROP COLUMN "DATE_FORMAT(time, '%Y-%m')";
