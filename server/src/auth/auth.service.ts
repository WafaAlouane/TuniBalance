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

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ResetToken.name) private resetTokenModel: Model<ResetToken>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerBusinessOwner(signupDto: SignupDto) {
    try {
      const existingUser = await this.usersService.findByEmail(signupDto.email);
      if (existingUser) throw new ConflictException('Email déjà utilisé');
  
      const newUser = await this.usersService.create({
        ...signupDto,
        role: UserRole.BUSINESS_OWNER
      });
  
      return {
        message: 'Inscription réussie',
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
    createStaffDto: SignupDto & { role: UserRole }, 
    businessOwnerId: string
  ) {
    if (![UserRole.FINANCIER, UserRole.ACCOUNTANT].includes(createStaffDto.role)) {
      throw new ForbiddenException('Rôle non autorisé');
    }

    return this.usersService.create({
      ...createStaffDto,
      createdBy: businessOwnerId
    });
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Identifiants invalides');
    }

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

  /*async login(loginDto: LoginDto) {
    // Normalisation de l'email
    const email = loginDto.email.toLowerCase().trim();
    const password = loginDto.password.trim();
  Logger.log("email"+email);
  Logger.log("password"+password);
    const user = await this.validateUser(email, password);
  
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
  
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
  }*/
  

  async changePassword(oldPassword:string,newdPassword:string,userId){
    const user= await this.userModel.findById(userId);
    if(!user){
        throw new NotFoundException("User Not Found");
    }
    const passwordMatch=await bcrypt.compare(oldPassword,user.password);
    if(!passwordMatch){
        throw new UnauthorizedException("Wrong credential");
    }
    const newHashedPassword=await bcrypt.hash(newdPassword,10);
    user.password=newHashedPassword;
    await user.save();


}

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({ email: forgetPasswordDto.email });
    if (!user) throw new NotFoundException('User not found');

    const resetToken = new this.resetTokenModel({
      userId: user._id,
      token: uuidv4(),
      expiryDate: new Date(Date.now() + 3600000), // 1 heure
    });

    await resetToken.save();
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

    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
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