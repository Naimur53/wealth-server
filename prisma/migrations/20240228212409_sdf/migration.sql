/*
  Warnings:

  - A unique constraint covering the columns `[replyId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Message_replyId_key" ON "Message"("replyId");
