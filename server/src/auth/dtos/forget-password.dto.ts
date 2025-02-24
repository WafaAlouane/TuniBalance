import { IsEmail, IsString, MinLength } from "class-validator";

export class ForgetPasswordDto{
 @IsEmail()
 email:string;
}