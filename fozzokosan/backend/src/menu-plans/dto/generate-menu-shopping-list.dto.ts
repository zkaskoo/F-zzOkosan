import { IsArray, IsOptional, IsString } from 'class-validator';

export class GenerateMenuShoppingListDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeAllergens?: string[];
}
