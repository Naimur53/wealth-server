-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "preview" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImg" SET DEFAULT '/assets/demo-user.png';
