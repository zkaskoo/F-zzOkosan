import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

interface ReqUser {
  id: string;
  email: string;
  name: string;
}

@Controller()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('recipes/:recipeId/favorite')
  @UseGuards(JwtAuthGuard)
  toggle(
    @Param('recipeId') recipeId: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.favoritesService.toggle(recipeId, req.user.id);
  }

  @Get('recipes/:recipeId/favorite')
  @UseGuards(OptionalJwtAuthGuard)
  async getStatus(
    @Param('recipeId') recipeId: string,
    @Request() req?: ExpressRequest & { user?: ReqUser },
  ) {
    const favorited = req?.user
      ? await this.favoritesService.isFavorited(recipeId, req.user.id)
      : false;
    return { favorited };
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  list(@Request() req: ExpressRequest & { user: ReqUser }) {
    return this.favoritesService.listForUser(req.user.id);
  }
}
