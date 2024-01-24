/*
  Warnings:

  - The `status` column on the `WithdrawalRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "WithdrawalRequest" DROP COLUMN "status",
ADD COLUMN     "status" "EStatusOfWithdrawalRequest" NOT NULL DEFAULT 'pending';
