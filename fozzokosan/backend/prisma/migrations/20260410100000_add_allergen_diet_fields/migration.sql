-- CreateEnum
CREATE TYPE "Allergen" AS ENUM ('GLUTEN', 'DAIRY', 'EGG', 'NUT', 'PEANUT', 'SOY', 'FISH', 'SHELLFISH', 'SESAME', 'CELERY', 'MUSTARD', 'SULPHITE');

-- CreateEnum
CREATE TYPE "DietaryTag" AS ENUM ('VEGETARIAN', 'VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE', 'KETO', 'PALEO', 'LOW_CARB', 'NUT_FREE');

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN "allergens" "Allergen"[] DEFAULT ARRAY[]::"Allergen"[];

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN "dietary_tags" "DietaryTag"[] DEFAULT ARRAY[]::"DietaryTag"[];
