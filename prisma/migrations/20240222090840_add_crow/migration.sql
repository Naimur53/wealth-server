-- AddForeignKey
ALTER TABLE "CrowdFund" ADD CONSTRAINT "CrowdFund_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
