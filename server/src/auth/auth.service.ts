import { Injectable, NotFoundException, UnauthorizedException, ConflictException, BadRequestException, ForbiddenException, InternalServerErrorException, forwardRef, Inject, Logger } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {  UserRole } from '../auth/enums/role.enum';
import { ResetToken } from './schemas/reset-token.schema';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignupDto } from './dtos/signup.dto';
import { User, UserDocument}from '../user/schemas/user.schema';
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
    // Générer un token de vérification unique
   const verificationToken = uuidv4();

    // Stocker le token en base (Ajoute un champ verificationToken dans User si nécessaire)
   await this.usersService.updateUser((newUser._id as string).toString(), { verificationToken });

    // Envoi de l'e-mail de confirmation
   await this.mailService.sendVerificationEmail(newUser.email, verificationToken);
      
      let phoneNumber = newUser.phoneNumber;

    // Vérification et ajout de l'indicatif si absent
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = `+216${phoneNumber}`;
    }

    const message = `Bienvenue ${newUser.name} ! Votre compte Business Owner a été créé avec succès.`;

    // Envoi du SMS avec le bon numéro
    await this.smsService.sendSMS(phoneNumber, message);

      return {
        message: 'Inscription réussie. Vérifiez votre email pour confirmer votre compte. ',
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        }
      };
      
    } catch (error) {
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
  
      // Ajouter une validation explicite du rôle
      if (![UserRole.FINANCIER, UserRole.ACCOUNTANT].includes(userData.role)) {
        throw new BadRequestException('Rôle invalide pour le staff');
      }
  
      const newUser = await this.usersService.create({
        ...userData,
        role: userData.role.toLowerCase() as UserRole, // Conversion explicite
        createdBy: businessOwnerId,
      });
  
      return newUser;
    } catch (error) {
      console.error("Erreur DB:", error);
      throw new InternalServerErrorException("Erreur technique");
    }
  }
  
  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email }).select('+password');
    
    if (!user) {
        throw new UnauthorizedException("Email not Found");
    }
    if (!user.isEmailConfirmed){
      throw new UnauthorizedException("verifier votre email");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    Logger.log(`Mot de passe stocké: ${user.password}`);
Logger.log(`Mot de passe entré: ${password}`);
Logger.log(`Résultat de bcrypt.compare: ${passwordMatch}`);
    if (!passwordMatch) {
        throw new UnauthorizedException("Invalid Password");
    }

    Logger.log("id of user is " + user._id);

    const payload = { 
        userId: user._id, 
        email: user.email,
        role: user.role 
    };
    
    return {
        accessToken: this.jwtService.sign(payload),
        user: {
            id: user._id,
            email: user.email,
            role: user.role
        }
    };
  }
  

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    
    if (!user) return null;
  
    // Utilisation de la méthode du schéma User
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return null;
  
    const { password: _, ...result } = user.toObject();
    return result;
  }

  

    async changePassword(oldPassword: string, newPassword: string, userId: string) {
      console.log(`Change password for user: ${userId}`);
      const user = await this.userModel.findById(userId);
      
      if (!user) {
        throw new NotFoundException("User Not Found");
      }
  
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException("Wrong credential");
      }
  
      user.password = newPassword; 
      await user.save();
  
      return { message: 'Password changed successfully' };
    }
  

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({ email: forgetPasswordDto.email });
    if (!user) throw new NotFoundException('User not found');

    // Generate reset token
    const resetToken = new this.resetTokenModel({
      userId: user._id,
      token: uuidv4(),
      expiryDate: new Date(Date.now() + 3600000), // 1 hour
    });

    await resetToken.save();

    const resetLink = `http://localhost:5173/reset-password?token${resetToken.token}`;

    try {
        
        await this.mailService.sendPasswordResetEmail(user.email, resetToken.token);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }

    return { 
      message: 'Reset link sent to email', 
      token: resetToken.token 
    };
}

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const tokenEntry = await this.resetTokenModel.findOne({ 
      token: resetPasswordDto.resetToken,
      expiryDate: { $gt: new Date() }
    });

    if (!tokenEntry) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userModel.findById(tokenEntry.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = resetPasswordDto.newPassword; 
    await user.save(); 

    await tokenEntry.deleteOne();
    return { message: 'Password reset successfully' };
  }





  private generateToken(user: UserDocument) {
    const payload = { 
      userId: user._id, 
      email: user.email,
      role: user.role 
    };
    
    return {
      accessToken: this.jwtService.sign(payload),  // Utilisation de jwtService pour signer le token
      user: {  // Les informations sur l'utilisateur à inclure dans la réponse
        id: user._id,
        email: user.email,
        role: user.role
      }
    };
  }
}  