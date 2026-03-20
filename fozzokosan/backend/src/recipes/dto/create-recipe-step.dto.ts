import { IsInt, IsString, MinLength, Min, IsOptional } from 'class-validator';

export class CreateRecipeStepDto {
  @IsInt()
  @Min(1)
  stepNumber: number;

  @IsString()
  @MinLength(1)
  instruction: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
