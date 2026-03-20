import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateRecipeIngredientDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
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
