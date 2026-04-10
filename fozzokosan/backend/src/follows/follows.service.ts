import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async toggle(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Nem követheted saját magadat');
    }

    const target = await this.prisma.user.findUnique({ where: { id: followingId } });
    if (!target) {
      throw new NotFoundException('A felhasználó nem található');
    }

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await this.prisma.follow.delete({ where: { id: existing.id } });
      return { following: false };
    }

    await this.prisma.follow.create({
      data: { followerId, followingId },
    });
    return { following: true };
  }

  async getStatus(followerId: string, followingId: string) {
    if (followerId === followingId) return { following: false };

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    return { following: !!existing };
  }
}
