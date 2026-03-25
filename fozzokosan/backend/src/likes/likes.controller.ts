import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

interface ReqUser {
  id: string;
  email: string;
  name: string;
}

@Controller('recipes/:recipeId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  toggle(
    @Param('recipeId') recipeId: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.likesService.toggle(recipeId, req.user.id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getStatus(
    @Param('recipeId') recipeId: string,
    @Request() req?: ExpressRequest & { user?: ReqUser },
  ) {
    const count = await this.likesService.getLikeCount(recipeId);
    const liked = req?.user
      ? await this.likesService.isLiked(recipeId, req.user.id)
      : false;
    return { count, liked };
  }
}
