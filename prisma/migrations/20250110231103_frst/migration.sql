-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'superAdmin');

-- CreateEnum
CREATE TYPE "EUserGender" AS ENUM ('male', 'female', 'transgender', 'others');

-- CreateEnum
CREATE TYPE "EUserStatus" AS ENUM ('pending', 'approved', 'denied');

-- CreateEnum
CREATE TYPE "EVerificationOtp" AS ENUM ('createUser', 'forgotPassword', 'deleteUser', 'adminLogin');

-- CreateEnum
CREATE TYPE "EPropertyStatus" AS ENUM ('sold', 'available', 'pending', 'denied');

-- CreateEnum
CREATE TYPE "EPropertyType" AS ENUM ('land', 'semiDetachedHouse', 'detachedHouse', 'finished', 'unFinished');

-- CreateEnum
CREATE TYPE "EOrderStatus" AS ENUM ('pending', 'success', 'denied');

-- CreateEnum
CREATE TYPE "EOrderRefName" AS ENUM ('crowdFund', 'flipping', 'property');

-- CreateEnum
CREATE TYPE "EOrderPaymentType" AS ENUM ('paystack', 'manual');

-- CreateEnum
CREATE TYPE "EBankType" AS ENUM ('usd', 'naira');

-- CreateEnum
CREATE TYPE "EChatGroupType" AS ENUM ('public', 'admin', 'champion');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "profileImg" TEXT DEFAULT 'https://truckomat.com/wp-content/uploads/2019/06/avatar-960_720-e1562935069333.png',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN,
    "status" "EUserStatus" NOT NULL DEFAULT 'pending',
    "gender" "EUserGender",
    "location" TEXT,
    "isChampion" BOOLEAN NOT NULL DEFAULT false,
    "deviceNotificationToken" TEXT,
    "isPaid" BOOLEAN DEFAULT false,
    "shouldSendNotification" BOOLEAN DEFAULT true,
    "txId" TEXT,
    "dateOfBirth" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationOtp" (
    "id" TEXT NOT NULL,
    "type" "EVerificationOtp" NOT NULL,
    "otp" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownById" TEXT NOT NULL,

    CONSTRAINT "VerificationOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rooms" INTEGER,
    "size" TEXT NOT NULL,
    "floor" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "streetLocation" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "images" TEXT[],
    "locationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EPropertyStatus" NOT NULL DEFAULT 'available',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "EPropertyType" NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyState" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "PropertyState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedPropertry" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "SavedPropertry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "amount" DOUBLE PRECISION NOT NULL,
    "propertyId" TEXT,
    "crowdFundId" TEXT,
    "flippingId" TEXT,
    "refName" "EOrderRefName" NOT NULL,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "paymentReceiptUrl" TEXT,
    "paystackId" TEXT,
    "paystackUrl" TEXT,
    "wealthBankId" TEXT,
    "orderById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EOrderStatus" NOT NULL DEFAULT 'pending',
    "paymentType" "EOrderPaymentType" NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bankAddress" TEXT,
    "shortCode" TEXT,
    "swiftCode" TEXT,
    "beneficiaryPhoneNumber" TEXT,
    "address" TEXT,
    "typeOfBank" "EBankType" NOT NULL,
    "logoOfBank" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrowdFund" (
    "id" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rooms" INTEGER,
    "size" TEXT NOT NULL,
    "floor" TEXT,
    "targetFund" DOUBLE PRECISION NOT NULL,
    "fundRaised" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "streetLocation" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "type" "EPropertyType" NOT NULL,
    "images" TEXT[],
    "locationId" TEXT NOT NULL,
    "status" "EPropertyStatus" NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrowdFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCrowdFund" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "crowdFundId" TEXT NOT NULL,

    CONSTRAINT "SavedCrowdFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flipping" (
    "id" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rooms" INTEGER,
    "size" TEXT NOT NULL,
    "floor" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "streetLocation" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "images" TEXT[],
    "docs" TEXT[],
    "type" "EPropertyType" NOT NULL,
    "status" "EPropertyStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownById" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "emergencyContact" TEXT,
    "emergencyEmail" TEXT,

    CONSTRAINT "Flipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedFlipping" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "flippingId" TEXT NOT NULL,

    CONSTRAINT "SavedFlipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "streetLocation" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionInterest" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "promotionId" TEXT NOT NULL,

    CONSTRAINT "PromotionInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatGroup" (
    "id" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EChatGroupType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chatGroupId" TEXT NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "replyId" TEXT,
    "sendById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeenMessage" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "seenById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeenMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "question" TEXT NOT NULL,
    "ans" TEXT NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPropertry_id_key" ON "SavedPropertry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_id_key" ON "Bank"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCrowdFund_id_key" ON "SavedCrowdFund"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SavedFlipping_id_key" ON "SavedFlipping"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_id_key" ON "Feedback"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_id_key" ON "Promotion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionInterest_id_key" ON "PromotionInterest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatGroup_id_key" ON "ChatGroup"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SeenMessage_id_key" ON "SeenMessage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Faq_id_key" ON "Faq"("id");

-- AddForeignKey
ALTER TABLE "VerificationOtp" ADD CONSTRAINT "VerificationOtp_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyState" ADD CONSTRAINT "PropertyState_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPropertry" ADD CONSTRAINT "SavedPropertry_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPropertry" ADD CONSTRAINT "SavedPropertry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_crowdFundId_fkey" FOREIGN KEY ("crowdFundId") REFERENCES "CrowdFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_flippingId_fkey" FOREIGN KEY ("flippingId") REFERENCES "Flipping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_wealthBankId_fkey" FOREIGN KEY ("wealthBankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrowdFund" ADD CONSTRAINT "CrowdFund_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCrowdFund" ADD CONSTRAINT "SavedCrowdFund_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCrowdFund" ADD CONSTRAINT "SavedCrowdFund_crowdFundId_fkey" FOREIGN KEY ("crowdFundId") REFERENCES "CrowdFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flipping" ADD CONSTRAINT "Flipping_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFlipping" ADD CONSTRAINT "SavedFlipping_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFlipping" ADD CONSTRAINT "SavedFlipping_flippingId_fkey" FOREIGN KEY ("flippingId") REFERENCES "Flipping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionInterest" ADD CONSTRAINT "PromotionInterest_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionInterest" ADD CONSTRAINT "PromotionInterest_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatGroupId_fkey" FOREIGN KEY ("chatGroupId") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sendById_fkey" FOREIGN KEY ("sendById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenMessage" ADD CONSTRAINT "SeenMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenMessage" ADD CONSTRAINT "SeenMessage_seenById_fkey" FOREIGN KEY ("seenById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
