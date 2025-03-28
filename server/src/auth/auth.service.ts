import { Injectable, NotFoundException, UnauthorizedException, ConflictException, BadRequestException, ForbiddenException, InternalServerErrorException, forwardRef, Inject, Logger } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../auth/enums/role.enum';
import { ResetToken } from './schemas/reset-token.schema';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignupDto } from './dtos/signup.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { SmsService } from '../sms/sms.service'; 
import { v4 as uuidv4 } from 'uuid';
import Mail from 'nodemailer/lib/mailer';
import { MailService } from 'src/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ResetToken.name) private resetTokenModel: Model<ResetToken>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService,
    private smsService: SmsService,
    private mailService: MailService
  ) {}

  async registerBusinessOwner(signupDto: SignupDto) {
    try {
      const existingUser = await this.usersService.findByEmail(signupDto.email);
      if (existingUser) throw new ConflictException('Email déjà utilisé');
  
      const newUser = await this.usersService.create({
        ...signupDto,
        role: UserRole.BUSINESS_OWNER,
        isEmailConfirmed: false, 
      });
      const verificationToken = uuidv4();
      await this.usersService.updateUser((newUser._id as string).toString(), { verificationToken });
      await this.mailService.sendVerificationEmail(newUser.email, verificationToken);
      
      let phoneNumber = newUser.phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+216${phoneNumber}`;
      }
      const message = `Bienvenue ${newUser.name} ! Votre compte Business Owner a été créé avec succès.`;
      await this.smsService.sendSMS(phoneNumber, message);
      
      return {
        message: 'Inscription réussie. Vérifiez votre email pour confirmer votre compte.',
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        }
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; 
      }
      console.error('Erreur lors de l\'inscription:', error);
      throw new InternalServerErrorException('Erreur technique lors de l\'inscription');
    }
  }
  async registerStaff(
    userData: SignupDto & { role: UserRole.FINANCIER | UserRole.ACCOUNTANT },
    businessOwnerId: string
  ): Promise<UserDocument> {
    try {
      const businessOwner = await this.usersService.findById(businessOwnerId);
      if (!businessOwner || businessOwner.role !== UserRole.BUSINESS_OWNER) {
        throw new UnauthorizedException("Seul un Business Owner peut créer du staff.");
      }
  
      if (![UserRole.FINANCIER, UserRole.ACCOUNTANT].includes(userData.role)) {
        throw new BadRequestException('Rôle invalide pour le staff');
      }
  
      const newUser = await this.usersService.create({
        ...userData,
        role: userData.role.toLowerCase() as UserRole,
        createdBy: businessOwnerId,
      });
  
      // Envoi de l'email au nouveau staff
      await this.mailService.sendStaffCreationEmail(
        newUser.email,
        newUser.name,
        userData.password, // Assurez-vous que le mot de passe n'est pas haché avant cet envoi
        newUser.role,
        businessOwner.name
      );
  
      return newUser;
    } catch (error) {
      console.error("Erreur DB:", error);
      throw new InternalServerErrorException("Erreur technique");
    }
  }
  
  
  // async registerStaff(
  //   userData: SignupDto & { role: UserRole.FINANCIER | UserRole.ACCOUNTANT },
  //   businessOwnerId: string
  // ): Promise<UserDocument> {
  //   try {
  //     const businessOwner = await this.usersService.findById(businessOwnerId);
  //     if (!businessOwner || businessOwner.role !== UserRole.BUSINESS_OWNER) {
  //       throw new UnauthorizedException("Seul un Business Owner peut créer du staff.");
  //     }
  
  //     if (![UserRole.FINANCIER, UserRole.ACCOUNTANT].includes(userData.role)) {
  //       throw new BadRequestException('Rôle invalide pour le staff');
  //     }
  
  //     const newUser = await this.usersService.create({
  //       ...userData,
  //       role: userData.role.toLowerCase() as UserRole,
  //       createdBy: businessOwnerId,
  //     });
  
  //     return newUser;
  //   } catch (error) {
  //     console.error("Erreur DB:", error);
  //     throw new InternalServerErrorException("Erreur technique");
  //   }
  // }
  
  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedException("Email not Found");
    if (!user.isEmailConfirmed) throw new UnauthorizedException("Vérifiez votre email");
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException("Invalid Password");
    
    const payload = { userId: user._id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user._id, email: user.email, role: user.role }
    };
  }
  
  async changePassword(oldPassword: string, newPassword: string, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User Not Found");
    
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) throw new UnauthorizedException("Wrong credential");
    
    user.password = newPassword;
    await user.save();
    return { message: 'Password changed successfully' };
  }
  
  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({ email: forgetPasswordDto.email });
    if (!user) throw new NotFoundException('User not found');
    
    const resetToken = new this.resetTokenModel({
      userId: user._id,
      token: uuidv4(),
      expiryDate: new Date(Date.now() + 3600000),
    });
    await resetToken.save();
    await this.mailService.sendPasswordResetEmail(user.email, resetToken.token);
    return { message: 'Reset link sent to email', token: resetToken.token };
  }
  
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const tokenEntry = await this.resetTokenModel.findOne({ 
      token: resetPasswordDto.resetToken,
      expiryDate: { $gt: new Date() }
    });
    if (!tokenEntry) throw new UnauthorizedException('Invalid or expired token');
    
    const user = await this.userModel.findById(tokenEntry.userId);
    if (!user) throw new NotFoundException('User not found');
    
    user.password = resetPasswordDto.newPassword;
    await user.save();
    await tokenEntry.deleteOne();
    return { message: 'Password reset successfully' };
  }
}
