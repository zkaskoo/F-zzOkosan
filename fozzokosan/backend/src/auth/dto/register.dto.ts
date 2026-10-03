import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Érvénytelen email-cím' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A jelszó legalább 6 karakter legyen' })
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(2, { message: 'A név legalább 2 karakter legyen' })
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
