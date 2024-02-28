/*
  Warnings:

  - You are about to drop the `Messaage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Messaage" DROP CONSTRAINT "Messaage_chatGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Messaage" DROP CONSTRAINT "Messaage_sendById_fkey";

-- DropForeignKey
ALTER TABLE "SeenMessage" DROP CONSTRAINT "SeenMessage_messageId_fkey";

-- DropTable
DROP TABLE "Messaage";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chatGroupId" TEXT NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "sendById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatGroupId_fkey" FOREIGN KEY ("chatGroupId") REFERENCES "ChatGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sendById_fkey" FOREIGN KEY ("sendById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenMessage" ADD CONSTRAINT "SeenMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
