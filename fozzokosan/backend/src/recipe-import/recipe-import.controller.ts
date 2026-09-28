import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RecipeImportService } from './recipe-import.service';
import { ImportRecipeDto } from './dto/import-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recipe-import')
@UseGuards(JwtAuthGuard)
export class RecipeImportController {
  constructor(private readonly recipeImportService: RecipeImportService) {}

  @Post()
  import(@Body() dto: ImportRecipeDto) {
    return this.recipeImportService.import({ url: dto.url, text: dto.text });
  }
}
