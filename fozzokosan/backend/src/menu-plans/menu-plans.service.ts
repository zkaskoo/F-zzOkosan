import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShoppingListsService } from '../shopping-lists/shopping-lists.service';
import { CreateMenuPlanDto, AddMenuItemDto } from './dto/create-menu-plan.dto';

const MENU_PLAN_INCLUDE = {
  items: {
    include: {
      recipe: {
        select: { id: true, title: true, imageUrl: true, cookingTime: true, servings: true },
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
    return this.findOne(planId, userId);
  }

  async generateShoppingList(planId: string, userId: string) {
    const plan = await this.findOne(planId, userId);

    if (plan.items.length === 0) {
      throw new NotFoundException('Az étlapterv üres, nem lehet bevásárlólistát generálni');
    }

    const recipeIds = [...new Set(plan.items.map((item) => item.recipeId))];

    return this.shoppingListsService.generate(
      {
        name: `${plan.name} - Bevásárlólista`,
        recipeIds,
      },
      userId,
    );
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
