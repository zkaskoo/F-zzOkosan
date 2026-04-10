import {
  IsString,
  IsDateString,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MealType } from '@prisma/client';

export class AddMenuItemDto {
  @IsString()
  recipeId: string;

  @IsDateString()
  date: string;

  @IsEnum(MealType)
  mealType: MealType;

  @IsOptional()
  @IsInt()
  @Min(1)
  servings?: number;
}

export class CreateMenuPlanDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddMenuItemDto)
  items?: AddMenuItemDto[];
}
