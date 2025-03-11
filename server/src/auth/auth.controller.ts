import { UsersService } from './../user/user.service';
import { BadRequestException, Body, Controller, NotFoundException, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
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
  constructor(private authService: AuthService,
    private usersService: UsersService,) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.registerBusinessOwner(signupDto);
  }


  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token manquant');

    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new NotFoundException('Token invalide ou expiré');

    // Mise à jour de l'utilisateur
    await this.usersService.updateUser(user._id as string, {
      isEmailConfirmed: true,
      verificationToken: null, // Supprimer le token après confirmation
    });

    return { message: 'Email confirmé avec succès. Vous pouvez maintenant vous connecter.' };
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




