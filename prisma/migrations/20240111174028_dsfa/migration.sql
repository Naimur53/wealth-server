-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownById" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencyRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "ownById" TEXT NOT NULL,

    CONSTRAINT "currencyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_id_key" ON "Currency"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_ownById_key" ON "Currency"("ownById");

-- CreateIndex
CREATE UNIQUE INDEX "currencyRequest_id_key" ON "currencyRequest"("id");

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currencyRequest" ADD CONSTRAINT "currencyRequest_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
