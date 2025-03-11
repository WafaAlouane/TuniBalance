import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import {Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from './enums/role.enum'


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.registerBusinessOwner(signupDto);
  }

  @Post('create-staff')
  @Roles(UserRole.BUSINESS_OWNER)
  @UseGuards(AuthGuard, RolesGuard)
  async createStaff(
    @Body() body: SignupDto & { role: UserRole.FINANCIER | UserRole.ACCOUNTANT },
    @Req() req
  ) {
    return this.authService.registerStaff(
      body,
      req.user.userId
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Post('protected')
  async protectedRoute() {
    return { message: 'Authorized access' };
  }
        @UseGuards(AuthGuard)
        @Put('change-password')
        async changePassword(@Body() changePasswordDto:ChangePasswordDto,@Req() req){
          return this.authService.changePassword(changePasswordDto.oldPassword,changePasswordDto.newPassword,req.userId);
      
      }

    @Post("forget-password")
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
        return this.authService.forgetPassword(forgetPasswordDto);
    }

    @Put("reset-password")
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}




