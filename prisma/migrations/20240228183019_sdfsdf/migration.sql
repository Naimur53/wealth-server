/*
  Warnings:

  - You are about to drop the column `messageId` on the `SeenMessage` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `SeenMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastSeen` to the `SeenMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SeenMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SeenMessage" DROP CONSTRAINT "SeenMessage_messageId_fkey";

-- AlterTable
ALTER TABLE "SeenMessage" DROP COLUMN "messageId",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "lastSeen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "SeenMessage" ADD CONSTRAINT "SeenMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ChatGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
