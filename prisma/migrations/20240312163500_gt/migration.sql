/*
  Warnings:

  - Added the required column `DATE_FORMAT(time, '%Y-%m')` to the `PropertyState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PropertyState" ADD COLUMN     "DATE_FORMAT(time, '%Y-%m')" TEXT NOT NULL;
