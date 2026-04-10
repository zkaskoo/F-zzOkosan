import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { NlpService } from './nlp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('nlp')
@UseGuards(JwtAuthGuard)
export class NlpController {
  constructor(private nlpService: NlpService) {}

  @Post('parse-ingredients')
  async parseIngredients(@Body('text') text: string) {
    const ingredients = await this.nlpService.parseIngredients(text || '');
    return { ingredients };
  }

  @Get('status')
  status() {
    return { configured: this.nlpService.isConfigured() };
  }
}
