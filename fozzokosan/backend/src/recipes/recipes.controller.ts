import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

interface ReqUser {
  id: string;
  email: string;
  name: string;
}

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.recipesService.create(createRecipeDto, req.user.id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('search') search?: string,
    @Query('dietaryTags') dietaryTags?: string,
    @Query('excludeAllergens') excludeAllergens?: string,
    @Request() req?: ExpressRequest & { user?: ReqUser },
  ) {
    return this.recipesService.findAll({
      page: page || 1,
      limit: limit || 10,
      userId,
      search,
      requesterId: req?.user?.id,
      dietaryTags: dietaryTags ? dietaryTags.split(',') : undefined,
      excludeAllergens: excludeAllergens ? excludeAllergens.split(',') : undefined,
    });
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @Request() req?: ExpressRequest & { user?: ReqUser },
  ) {
    return this.recipesService.findOne(id, req?.user?.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.recipesService.update(id, updateRecipeDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: ReqUser },
  ) {
    return this.recipesService.remove(id, req.user.id);
  }
}
