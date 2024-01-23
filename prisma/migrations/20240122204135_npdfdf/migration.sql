-- CreateEnum
CREATE TYPE "accountType" AS ENUM ('SocialMedia', 'Game', 'Email', 'Vpn', 'Other');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "accountCategory" ADD VALUE 'Threads';
ALTER TYPE "accountCategory" ADD VALUE 'Telegram';
ALTER TYPE "accountCategory" ADD VALUE 'Whatsapp';
ALTER TYPE "accountCategory" ADD VALUE 'Playstation';
ALTER TYPE "accountCategory" ADD VALUE 'CallOfDuty';
ALTER TYPE "accountCategory" ADD VALUE 'Pubg';
ALTER TYPE "accountCategory" ADD VALUE 'Steam';
ALTER TYPE "accountCategory" ADD VALUE 'Gmail';
ALTER TYPE "accountCategory" ADD VALUE 'Ymail';
ALTER TYPE "accountCategory" ADD VALUE 'Hotmail';
ALTER TYPE "accountCategory" ADD VALUE 'MailRu';
ALTER TYPE "accountCategory" ADD VALUE 'Outlook';
ALTER TYPE "accountCategory" ADD VALUE 'Windscribe';
ALTER TYPE "accountCategory" ADD VALUE 'Nord';
ALTER TYPE "accountCategory" ADD VALUE 'Vpn911';
ALTER TYPE "accountCategory" ADD VALUE 'Other';

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "accountType" "accountType" NOT NULL DEFAULT 'SocialMedia';
