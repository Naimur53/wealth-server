/*
  Warnings:

  - Added the required column `ownById` to the `Flipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flipping" ADD COLUMN     "ownById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Flipping" ADD CONSTRAINT "Flipping_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
