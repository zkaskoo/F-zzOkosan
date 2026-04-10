import { IsString, IsArray, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateShoppingListDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsArray()
  @IsString({ each: true })
  recipeIds: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeAllergens?: string[];
}
