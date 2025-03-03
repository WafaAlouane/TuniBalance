import { IsEmail, Matches, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../enums/role.enum';

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;

  @IsOptional() // Le rôle peut être défini, sinon c'est Business Owner par défaut
  @IsEnum(UserRole)
  role?: UserRole;

}
