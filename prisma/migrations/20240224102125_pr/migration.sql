-- CreateEnum
CREATE TYPE "EPropertyStatus" AS ENUM ('sold', 'available', 'pending', 'denied');

-- AlterTable
ALTER TABLE "CrowdFund" ADD COLUMN     "status" "EPropertyStatus" NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE "Flipping" ADD COLUMN     "status" "EPropertyStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "status" "EPropertyStatus" NOT NULL DEFAULT 'available';

-- DropEnum
DROP TYPE "EPropertySoldStatus";
