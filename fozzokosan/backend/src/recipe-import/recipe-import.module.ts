import { Module } from '@nestjs/common';
import { RecipeImportService } from './recipe-import.service';
import { RecipeImportController } from './recipe-import.controller';
import { NlpModule } from '../nlp/nlp.module';

@Module({
  imports: [NlpModule],
  controllers: [RecipeImportController],
  providers: [RecipeImportService],
})
export class RecipeImportModule {}
