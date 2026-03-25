import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'A hozzászólás nem lehet üres' })
  @MaxLength(2000, { message: 'A hozzászólás legfeljebb 2000 karakter lehet' })
  content: string;
}
