import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { sign } from 'crypto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
constructor(private userService :AuthService){}
@Post("signup")
async signUp(@Body() signupData:SignupDto){
    return this.userService.signup(signupData); 

}

@Post("login")
async login(@Body() loginData:LoginDto){
    return this.userService.login(loginData);


}


}
