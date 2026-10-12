import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Allergen } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { CreateMenuPlanDto, AddMenuItemDto } from './dto/create-menu-plan.dto';

const MENU_PLAN_INCLUDE = {
  items: {
    include: {
      recipe: {
        select: { id: true, slug: true, title: true, imageUrl: true, cookingTime: true, servings: true },
      },
    },
    orderBy: [{ date: 'asc' as const }, { mealType: 'asc' as const }],
  },
};

@Injectable()
export class MenuPlansService {
  constructor(
    private prisma: PrismaService,
    private shoppingListsService: ShoppingListsService,
  ) {}

  async create(dto: CreateMenuPlanDto, userId: string) {
    return this.prisma.menuPlan.create({
      data: {
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        userId,
        items: dto.items
          ? {
              create: dto.items.map((item) => ({
                recipeId: item.recipeId,
                date: new Date(item.date),
                mealType: item.mealType,
                servings: item.servings ?? 4,
              })),
            }
          : undefined,
      },
      include: MENU_PLAN_INCLUDE,
    });
  }

  async findAll(userId: string) {
    return this.prisma.menuPlan.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      include: MENU_PLAN_INCLUDE,
    });
  }

  async findOne(id: string, userId: string) {
    const plan = await this.prisma.menuPlan.findUnique({
      where: { id },
      include: MENU_PLAN_INCLUDE,
    });

    if (!plan || plan.userId !== userId) {
      throw new NotFoundException('Az étlapterv nem található');
    }

    return plan;
  }

  async addItem(planId: string, dto: AddMenuItemDto, userId: string) {
    const plan = await this.prisma.menuPlan.findUnique({ where: { id: planId } });
    if (!plan || plan.userId !== userId) {
      throw new NotFoundException('Az étlapterv nem található');
    }

    await this.prisma.menuItem.create({
      data: {
        menuPlanId: planId,
        recipeId: dto.recipeId,
        date: new Date(dto.date),
        mealType: dto.mealType,
        servings: dto.servings ?? 4,
      },
    });

    // A terv tartalma változott → frissítjük az időbélyeget, hogy a következő
    // bevásárlólista-generálás tudja, hogy újat kell készíteni.
    await this.prisma.menuPlan.update({
      where: { id: planId },
      data: { updatedAt: new Date() },
    });

    return this.findOne(planId, userId);
  }

  async removeItem(planId: string, itemId: string, userId: string) {
    const plan = await this.prisma.menuPlan.findUnique({ where: { id: planId } });
    if (!plan || plan.userId !== userId) {
      throw new NotFoundException('Az étlapterv nem található');
    }

    const item = await this.prisma.menuItem.findUnique({ where: { id: itemId } });
    if (!item || item.menuPlanId !== planId) {
      throw new NotFoundException('Az elem nem található');
    }

    await this.prisma.menuItem.delete({ where: { id: itemId } });

    // Tartalmi változás → időbélyeg frissítése (lásd addItem).
    await this.prisma.menuPlan.update({
      where: { id: planId },
      data: { updatedAt: new Date() },
    });

    return this.findOne(planId, userId);
  }

  async generateShoppingList(
    planId: string,
    userId: string,
    excludeAllergens: Allergen[] = [],
  ) {
    const plan = await this.findOne(planId, userId);

    if (plan.items.length === 0) {
      throw new NotFoundException('Az étlapterv üres, nem lehet bevásárlólistát generálni');
    }

    const normalizedAllergens = [...new Set(excludeAllergens)].sort();

    // Ha már van ehhez a tervhez tartozó lista, és azóta sem a terv tartalma,
    // sem a kizárt allergének nem változtak, akkor nem generálunk újat, hanem
    // visszaadjuk a meglévőt. Így az ismételt kattintás nem hoz létre duplikátumokat.
    const existing = await this.prisma.shoppingList.findFirst({
      where: { menuPlanId: planId, userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    if (
      existing &&
      existing.createdAt >= plan.updatedAt &&
      this.sameAllergens(existing.excludeAllergens, normalizedAllergens)
    ) {
      return existing;
    }

    // Változott a terv vagy az allergénszűrés → a korábbi, elavult listá(ka)t
    // eldobjuk, és frisset készítünk.
    await this.prisma.shoppingList.deleteMany({
      where: { menuPlanId: planId, userId },
    });

    const recipeIds = [...new Set(plan.items.map((item) => item.recipeId))];

    return this.shoppingListsService.generate(
      {
        name: `${plan.name} - Bevásárlólista`,
        recipeIds,
        excludeAllergens: normalizedAllergens,
      },
      userId,
      planId,
    );
  }

  /** Két allergénlista tartalmilag egyezik-e (sorrendtől függetlenül). */
  private sameAllergens(a: Allergen[], b: Allergen[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, i) => val === sortedB[i]);
  }

  async remove(id: string, userId: string) {
    const plan = await this.prisma.menuPlan.findUnique({ where: { id } });
    if (!plan || plan.userId !== userId) {
      throw new NotFoundException('Az étlapterv nem található');
    }

    await this.prisma.menuPlan.delete({ where: { id } });
    return { message: 'Az étlapterv sikeresen törölve' };
  }
}
