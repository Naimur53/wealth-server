-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deviceNotificationToken" TEXT,
ADD COLUMN     "isPaid" BOOLEAN DEFAULT false,
ADD COLUMN     "shouldSendNotification" BOOLEAN DEFAULT true,
ADD COLUMN     "txId" TEXT;
