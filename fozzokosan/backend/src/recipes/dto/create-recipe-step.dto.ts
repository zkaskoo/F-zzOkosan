import {
  IsInt,
  IsString,
  MinLength,
  Min,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateRecipeStepDto {
  @IsInt()
  @Min(1)
  stepNumber: number;

  @IsString()
  @MinLength(1)
  instruction: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
