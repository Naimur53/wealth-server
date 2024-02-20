-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'superAdmin');

-- CreateEnum
CREATE TYPE "EUserStatus" AS ENUM ('pending', 'approved', 'denied');

-- CreateEnum
CREATE TYPE "EVerificationOtp" AS ENUM ('createUser', 'forgotPassword');

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
    "profileImg" TEXT DEFAULT '/assets/demo-user.png',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN,
    "status" "EUserStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationOtp" (
    "id" TEXT NOT NULL,
    "type" "EVerificationOtp" NOT NULL,
    "otp" INTEGER NOT NULL,
    "ownById" TEXT NOT NULL,

    CONSTRAINT "VerificationOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "VerificationOtp" ADD CONSTRAINT "VerificationOtp_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
