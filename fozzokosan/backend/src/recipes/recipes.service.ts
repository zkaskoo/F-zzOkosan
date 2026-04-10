import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UnitsService } from '../units/units.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateRecipeIngredientDto } from './dto/create-recipe-ingredient.dto';

const RECIPE_FULL_INCLUDE = {
  user: { select: { id: true, name: true, avatar: true } },
  steps: { orderBy: { stepNumber: 'asc' as const } },
  ingredients: { include: { ingredient: true } },
  categories: true,
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.RecipeInclude;

const MAX_LIMIT = 100;

@Injectable()
export class RecipesService {
  constructor(
    private prisma: PrismaService,
    private unitsService: UnitsService,
  ) {}

  private normalizeIngredient(ing: CreateRecipeIngredientDto) {
    const converted = this.unitsService.convertToBase(ing.quantity, ing.unit);
    const normalizedUnit = this.unitsService.normalizeUnit(ing.unit);
    return {
      quantity: ing.quantity,
      unit: normalizedUnit,
      normalizedQuantity: converted.quantity,
      normalizedUnit: converted.unit,
    };
  }

  async create(createRecipeDto: CreateRecipeDto, userId: string) {
    const { steps, ingredients, ...recipeData } = createRecipeDto;

    return this.prisma.$transaction(async (prisma) => {
      const recipe = await prisma.recipe.create({
        data: {
          ...recipeData,
          userId,
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
            where: { normalizedName },
            update: {},
            create: {
              name: ing.ingredientName,
              normalizedName,
            },
          });

          const normalized = this.normalizeIngredient(ing);
          await prisma.recipeIngredient.createMany({
            data: [
              {
                recipeId: recipe.id,
                ingredientId: ingredient.id,
                quantity: normalized.quantity,
                unit: normalized.unit,
                normalizedQuantity: normalized.normalizedQuantity,
                normalizedUnit: normalized.normalizedUnit,
                notes: ing.notes,
                isOptional: ing.isOptional ?? false,
              },
            ],
          });
        }
      }

      // Re-fetch the recipe with all relations to return fresh data
      const fullRecipe = await prisma.recipe.findUnique({
        where: { id: recipe.id },
        include: RECIPE_FULL_INCLUDE,
      });

      return fullRecipe;
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    userId?: string;
    search?: string;
    requesterId?: string;
    dietaryTags?: string[];
    excludeAllergens?: string[];
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where: Prisma.RecipeWhereInput = {};

    if (params.userId) {
      where.userId = params.userId;
      if (params.requesterId && params.requesterId !== params.userId) {
        where.isPublic = true;
      }
    } else {
      where.isPublic = true;
    }

    if (params.search) {
      const searchTerm = params.search.trim();
      if (searchTerm.length > 0) {
        where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        {
          ingredients: {
            some: {
              ingredient: {
                name: { contains: searchTerm, mode: 'insensitive' },
              },
            },
          },
        },
      ];
      }
    }

    // Filter by dietary tags (recipe must have ALL specified tags)
    if (params.dietaryTags && params.dietaryTags.length > 0) {
      where.dietaryTags = { hasEvery: params.dietaryTags as any };
    }

    // Exclude recipes containing ingredients with specified allergens
    if (params.excludeAllergens && params.excludeAllergens.length > 0) {
      where.ingredients = {
        none: {
          ingredient: {
            allergens: { hasSome: params.excludeAllergens as any },
          },
        },
      };
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
      include: RECIPE_FULL_INCLUDE,
    });

    if (!recipe) {
      throw new NotFoundException('A recept nem található');
    }

    if (!recipe.isPublic && recipe.userId !== requesterId) {
      throw new NotFoundException('A recept nem található');
    }

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('A recept nem található');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('Csak a saját receptjeidet szerkesztheted');
    }

    const { steps, ingredients, ...recipeData } = updateRecipeDto;

    return this.prisma.$transaction(async (prisma) => {
      await prisma.recipe.update({
        where: { id },
        data: recipeData,
      });

      // Replace steps if provided
      if (steps !== undefined) {
        await prisma.recipeStep.deleteMany({ where: { recipeId: id } });

        if (steps.length > 0) {
          await prisma.recipeStep.createMany({
            data: steps.map((step) => ({
              recipeId: id,
              stepNumber: step.stepNumber,
              instruction: step.instruction,
              imageUrl: step.imageUrl,
            })),
          });
        }
      }

      // Replace ingredients if provided
      if (ingredients !== undefined) {
        await prisma.recipeIngredient.deleteMany({
          where: { recipeId: id },
        });

        if (ingredients.length > 0) {
          for (const ing of ingredients) {
            const normalizedName = ing.ingredientName.toLowerCase().trim();
            const ingredient = await prisma.ingredient.upsert({
              where: { normalizedName },
              update: {},
              create: {
                name: ing.ingredientName,
                normalizedName,
              },
            });

            const normalized = this.normalizeIngredient(ing);
            await prisma.recipeIngredient.create({
              data: {
                recipeId: id,
                ingredientId: ingredient.id,
                quantity: normalized.quantity,
                unit: normalized.unit,
                normalizedQuantity: normalized.normalizedQuantity,
                normalizedUnit: normalized.normalizedUnit,
                notes: ing.notes,
                isOptional: ing.isOptional ?? false,
              },
            });
          }
        }
      }

      // Re-fetch with all relations for fresh data
      return prisma.recipe.findUnique({
        where: { id },
        include: RECIPE_FULL_INCLUDE,
      });
    });
  }

  async remove(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('A recept nem található');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('Csak a saját receptjeidet törölheted');
    }

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: 'A recept sikeresen törölve' };
  }
}
