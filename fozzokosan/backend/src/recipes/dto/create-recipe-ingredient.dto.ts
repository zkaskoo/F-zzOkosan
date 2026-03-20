import { IsString, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

export class CreateRecipeIngredientDto {
  @IsString()
  ingredientName: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;
}
