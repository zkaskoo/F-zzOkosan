import { IsString, IsNotEmpty } from 'class-validator';

export class ConvertQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'A mennyiség megadása kötelező' })
  quantity: string;

  @IsString()
  @IsNotEmpty({ message: 'A mértékegység megadása kötelező' })
  unit: string;
}
