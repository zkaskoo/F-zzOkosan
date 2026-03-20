-- DropIndex
DROP INDEX "ingredients_name_key";

-- DropIndex
DROP INDEX "ingredients_normalized_name_idx";

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_normalized_name_key" ON "ingredients"("normalized_name");
