/*
  Warnings:

  - The values [champion] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `locationId` on the `Flipping` table. All the data in the column will be lost.
  - Added the required column `location` to the `Flipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('user', 'admin', 'superAdmin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- DropForeignKey
ALTER TABLE "Flipping" DROP CONSTRAINT "Flipping_locationId_fkey";

-- AlterTable
ALTER TABLE "Flipping" DROP COLUMN "locationId",
ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "champion" BOOLEAN NOT NULL DEFAULT false;
