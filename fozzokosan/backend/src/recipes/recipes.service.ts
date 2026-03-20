import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto, userId: string) {
    const { steps, ingredients, ...recipeData } = createRecipeDto;

    return this.prisma.$transaction(async (prisma) => {
      const recipe = await prisma.recipe.create({
        data: {
          ...recipeData,
          userId,
        },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          steps: { orderBy: { stepNumber: 'asc' } },
          ingredients: { include: { ingredient: true } },
          categories: true,
          _count: { select: { likes: true, comments: true } },
        },
      });

      if (steps && steps.length > 0) {
        await prisma.recipeStep.createMany({
          data: steps.map((step) => ({
            recipeId: recipe.id,
            stepNumber: step.stepNumber,
            instruction: step.instruction,
            imageUrl: step.imageUrl,
          })),
        });
      }

      if (ingredients && ingredients.length > 0) {
        for (const ing of ingredients) {
          const normalizedName = ing.ingredientName.toLowerCase().trim();
          const ingredient = await prisma.ingredient.upsert({
            where: { name: ing.ingredientName },
            update: {},
            create: {
              name: ing.ingredientName,
              normalizedName,
            },
          });

          await prisma.recipeIngredient.createMany({
            data: [
              {
                recipeId: recipe.id,
                ingredientId: ingredient.id,
                quantity: ing.quantity,
                unit: ing.unit,
                notes: ing.notes,
                isOptional: ing.isOptional ?? false,
              },
            ],
          });
        }
      }

      return recipe;
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    userId?: string;
    requesterId?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.userId) {
      where.userId = params.userId;
      // If the requester is browsing another user's recipes, only show public
      if (params.requesterId && params.requesterId !== params.userId) {
        where.isPublic = true;
      }
      // If no requesterId or requesterId === userId, show all (no isPublic filter)
    } else {
      // No userId filter: only show public recipes
      where.isPublic = true;
    }

    const [data, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, requesterId?: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        steps: { orderBy: { stepNumber: 'asc' } },
        ingredients: { include: { ingredient: true } },
        categories: true,
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (!recipe.isPublic && recipe.userId !== requesterId) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    const { steps, ingredients, ...recipeData } = updateRecipeDto;

    const updatedRecipe = await this.prisma.recipe.update({
      where: { id },
      data: recipeData,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        steps: { orderBy: { stepNumber: 'asc' } },
        ingredients: { include: { ingredient: true } },
        categories: true,
        _count: { select: { likes: true, comments: true } },
      },
    });

    return updatedRecipe;
  }

  async remove(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: 'Recipe deleted successfully' };
  }
}
