import { IsEmail } from 'class-validator';

export class ResendVerificationDto {
  @IsEmail({}, { message: 'Érvénytelen email-cím' })
  email: string;
}
