/*
  Warnings:

  - The values [GitHub] on the enum `accountCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "accountCategory_new" AS ENUM ('Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Pinterest', 'Snapchat', 'TikTok', 'YouTube', 'GoogleVoice', 'Threads', 'Telegram', 'Whatsapp', 'Playstation', 'CallOfDuty', 'Pubg', 'Steam', 'Gmail', 'Ymail', 'Hotmail', 'MailRu', 'Outlook', 'Windscribe', 'Nord', 'Vpn911', 'Other', 'Netflix', 'Apple', 'TrustWallet', 'AmazonPrimeVideos');
ALTER TABLE "Account" ALTER COLUMN "category" TYPE "accountCategory_new" USING ("category"::text::"accountCategory_new");
ALTER TYPE "accountCategory" RENAME TO "accountCategory_old";
ALTER TYPE "accountCategory_new" RENAME TO "accountCategory";
DROP TYPE "accountCategory_old";
COMMIT;
