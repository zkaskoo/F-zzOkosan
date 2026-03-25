import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async toggle(recipeId: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('A recept nem található');
    }

    const existing = await this.prisma.like.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });

    if (existing) {
      await this.prisma.like.delete({
        where: { id: existing.id },
      });
      return { liked: false };
    }

    await this.prisma.like.create({
      data: { userId, recipeId },
    });
    return { liked: true };
  }

  async isLiked(recipeId: string, userId: string): Promise<boolean> {
    const like = await this.prisma.like.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });
    return !!like;
  }

  async getLikeCount(recipeId: string): Promise<number> {
    return this.prisma.like.count({
      where: { recipeId },
    });
  }
}
