import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { sign } from 'crypto';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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
@UseGuards(AuthGuard)
@Put('change-password')

async changePassword(@Body() changePasswordDto:ChangePasswordDto,@Req() req){
    return this.userService.changePassword(changePasswordDto.oldPassword,changePasswordDto.newPassword,req.userId);

}
@Post("forget-password")
async forgetPassword(@Body() forgetPasswordDto:ForgetPasswordDto){
    return this.userService.forgetPassword(forgetPasswordDto.email);


}
@Put("reset-password")
async resetPassword(@Body() resetPasswordDto:ResetPasswordDto){
    return this.userService.resetPassword(resetPasswordDto.newPassword,resetPasswordDto.resetToken);
}
}