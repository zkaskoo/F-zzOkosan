import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(recipeId: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('A recept nem található');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, recipeId } });
    return { favorited: true };
  }

  async isFavorited(recipeId: string, userId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });
    return !!favorite;
  }

  /**
   * A bejelentkezett felhasználó kedvenc receptjei, legutóbb mentett elöl.
   */
  async listForUser(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        recipe: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            _count: { select: { likes: true, comments: true } },
          },
        },
      },
    });

    return favorites.map((fav) => fav.recipe);
  }
}
