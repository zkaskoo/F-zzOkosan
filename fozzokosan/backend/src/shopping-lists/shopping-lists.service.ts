import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnitsService } from '../units/units.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { Allergen } from '@prisma/client';

interface MergedItem {
  ingredientName: string;
  quantity: number;
  unit: string;
  sourceRecipes: string[];
}

@Injectable()
export class ShoppingListsService {
  constructor(
    private prisma: PrismaService,
    private unitsService: UnitsService,
  ) {}

  async generate(dto: CreateShoppingListDto, userId: string) {
    const recipes = await this.prisma.recipe.findMany({
      where: { id: { in: dto.recipeIds } },
      include: {
        ingredients: { include: { ingredient: true } },
      },
    });

    if (recipes.length === 0) {
      throw new NotFoundException('Nem található recept a megadott azonosítókkal');
    }

    // Collect all ingredients, filtering allergens
    const excludeAllergens = (dto.excludeAllergens ?? []) as Allergen[];
    const merged = new Map<string, MergedItem>();

    for (const recipe of recipes) {
      for (const ri of recipe.ingredients) {
        if (ri.isOptional) continue;

        // Skip if ingredient has an excluded allergen
        if (excludeAllergens.length > 0) {
          const hasExcluded = ri.ingredient.allergens.some((a) =>
            excludeAllergens.includes(a),
          );
          if (hasExcluded) continue;
        }

        const key = ri.ingredient.normalizedName;
        const existing = merged.get(key);

        if (existing) {
          // Try to merge quantities if units are compatible
          if (this.unitsService.areUnitsCompatible(existing.unit, ri.unit)) {
            const base1 = this.unitsService.convertToBase(existing.quantity, existing.unit);
            const base2 = this.unitsService.convertToBase(ri.quantity, ri.unit);
            existing.quantity = Math.round((base1.quantity + base2.quantity) * 100) / 100;
            existing.unit = base1.unit;
          } else {
            // Incompatible units - just add the quantity (best effort)
            existing.quantity += ri.quantity;
          }
          if (!existing.sourceRecipes.includes(recipe.id)) {
            existing.sourceRecipes.push(recipe.id);
          }
        } else {
          const base = this.unitsService.convertToBase(ri.quantity, ri.unit);
          merged.set(key, {
            ingredientName: ri.ingredient.name,
            quantity: base.quantity,
            unit: base.unit,
            sourceRecipes: [recipe.id],
          });
        }
      }
    }

    // Create shopping list with merged items
    return this.prisma.shoppingList.create({
      data: {
        name: dto.name,
        userId,
        items: {
          create: Array.from(merged.values()).map((item) => ({
            ingredientName: item.ingredientName,
            quantity: item.quantity,
            unit: item.unit,
            sourceRecipes: item.sourceRecipes,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        _count: { select: { items: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!list || list.userId !== userId) {
      throw new NotFoundException('A bevásárlólista nem található');
    }

    return list;
  }

  async toggleItem(id: string, itemId: string, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({ where: { id } });
    if (!list || list.userId !== userId) {
      throw new NotFoundException('A bevásárlólista nem található');
    }

    const item = await this.prisma.shoppingListItem.findUnique({
      where: { id: itemId },
    });
    if (!item || item.shoppingListId !== id) {
      throw new NotFoundException('Az elem nem található');
    }

    return this.prisma.shoppingListItem.update({
      where: { id: itemId },
      data: { isChecked: !item.isChecked },
    });
  }

  async remove(id: string, userId: string) {
    const list = await this.prisma.shoppingList.findUnique({ where: { id } });
    if (!list || list.userId !== userId) {
      throw new NotFoundException('A bevásárlólista nem található');
    }

    await this.prisma.shoppingList.delete({ where: { id } });
    return { message: 'A bevásárlólista sikeresen törölve' };
  }
}
