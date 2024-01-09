-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" TEXT,
    "approvedForSale" BOOLEAN,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" TEXT NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_id_key" ON "account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_id_key" ON "cart"("id");
