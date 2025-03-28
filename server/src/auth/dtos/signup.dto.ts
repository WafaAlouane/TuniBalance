import { IsEmail, Matches, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../enums/role.enum';
<<<<<<< HEAD

=======
import { Transform } from 'class-transformer';
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

<<<<<<< HEAD
  @Matches( /^[+216]{4}[0-9]{8}$/, { message: 'Phone number must be 8 digits' })
  phoneNumber: string;

  @IsOptional() // Le rôle peut être défini, sinon c'est Business Owner par défaut
  @IsEnum(UserRole)
=======
  @Matches(/^(\+216)?[0-9]{8}$/, { 
    message: 'Le numéro doit être +216 suivi de 8 chiffres.' 
  })
  phoneNumber: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Transform(({ value }) => value?.toLowerCase()) // Conversion automatique
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
  role?: UserRole;

  @IsOptional() 
  isEmailConfirmed?: boolean;
  

}
