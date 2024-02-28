/*
  Warnings:

  - The values [private] on the enum `EChatGroupType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EChatGroupType_new" AS ENUM ('public', 'admin', 'champion');
ALTER TABLE "ChatGroup" ALTER COLUMN "type" TYPE "EChatGroupType_new" USING ("type"::text::"EChatGroupType_new");
ALTER TYPE "EChatGroupType" RENAME TO "EChatGroupType_old";
ALTER TYPE "EChatGroupType_new" RENAME TO "EChatGroupType";
DROP TYPE "EChatGroupType_old";
COMMIT;
