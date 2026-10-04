import {
  IsInt,
  IsString,
  MinLength,
  Min,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateRecipeStepDto {
  @IsInt()
  @Min(1)
  stepNumber: number;

  @IsString()
  @MinLength(1)
  instruction: string;

  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/|\/uploads\/)/, {
    message: 'A kép http(s):// címmel vagy /uploads/ útvonallal kezdődjön',
  })
  imageUrl?: string;
}
