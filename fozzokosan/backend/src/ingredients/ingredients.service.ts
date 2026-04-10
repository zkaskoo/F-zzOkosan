import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, limit = 10) {
    const trimmed = query.trim();
    if (trimmed.length === 0) return [];

    return this.prisma.ingredient.findMany({
      where: {
        name: { contains: trimmed, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
      take: Math.min(limit, 20),
      select: {
        id: true,
        name: true,
        normalizedName: true,
        defaultUnit: true,
        category: true,
      },
    });
  }
}
