import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Érvénytelen email-cím' })
  email: string;
}
