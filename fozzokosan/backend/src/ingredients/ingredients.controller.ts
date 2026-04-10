import { Controller, Get, Query } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.ingredientsService.search(query || '');
  }
}
