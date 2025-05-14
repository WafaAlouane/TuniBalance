import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim()) // Ajouté
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}