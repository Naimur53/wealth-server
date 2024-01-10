/*
  Warnings:

  - Added the required column `password` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "accountCategory" AS ENUM ('Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Pinterest', 'Snapchat', 'TikTok', 'YouTube', 'GitHub');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "accountCategory" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBlocked" BOOLEAN;
