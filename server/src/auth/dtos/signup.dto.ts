import { IsEmail, Matches, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../enums/role.enum';
import { Transform } from 'class-transformer';
export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Matches(/^(\+216)?[0-9]{8}$/, { 
    message: 'Le numéro doit être +216 suivi de 8 chiffres.' 
  })
  phoneNumber: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(({ value }) => value?.toLowerCase()) // Conversion automatique
  role?: UserRole;

  @IsOptional() 
  isEmailConfirmed?: boolean;
  

}
