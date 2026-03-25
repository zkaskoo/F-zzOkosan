import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(recipeId: string, userId: string, dto: CreateCommentDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('A recept nem található');
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        userId,
        recipeId,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async findByRecipe(recipeId: string, page = 1, limit = 20) {
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { recipeId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.comment.count({ where: { recipeId } }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('A hozzászólás nem található');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Csak a saját hozzászólásaidat törölheted');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
    return { message: 'A hozzászólás sikeresen törölve' };
  }
}
