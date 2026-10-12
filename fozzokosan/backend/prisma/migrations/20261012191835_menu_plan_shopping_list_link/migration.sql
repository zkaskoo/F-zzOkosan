-- AlterTable
ALTER TABLE "menu_plans" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "shopping_lists" ADD COLUMN     "exclude_allergens" "Allergen"[] DEFAULT ARRAY[]::"Allergen"[],
ADD COLUMN     "menu_plan_id" TEXT;

-- CreateIndex
CREATE INDEX "shopping_lists_menu_plan_id_idx" ON "shopping_lists"("menu_plan_id");

-- AddForeignKey
ALTER TABLE "shopping_lists" ADD CONSTRAINT "shopping_lists_menu_plan_id_fkey" FOREIGN KEY ("menu_plan_id") REFERENCES "menu_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
