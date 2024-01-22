/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Orders_accountId_key" ON "Orders"("accountId");
