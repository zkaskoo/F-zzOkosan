import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ImportRecipeDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  text?: string;
}
