-- AlterTable
ALTER TABLE "Flipping" ADD COLUMN     "docs" TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImg" SET DEFAULT 'https://truckomat.com/wp-content/uploads/2019/06/avatar-960_720-e1562935069333.png';
