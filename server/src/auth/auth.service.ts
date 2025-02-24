import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as  bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { nanoid } from 'nanoid';
import { ResetToken } from './schemas/reset-token.schema';
import Mail from 'nodemailer/lib/mailer';
import { MailService } from 'src/services/mail.service';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private UserModel:Model<User>,private jwtservice:JwtService,
@InjectModel(ResetToken.name)private resetTokenModel:Model<ResetToken>,
private mailService:MailService) { }
    async signup(signupData:SignupDto){
        //extracting email,password and name from body
        const {email,password,name} = signupData;
        const emailInUse= await this.UserModel.findOne({email});
        if(emailInUse){
            throw new BadRequestException("email already in use");
        }
        //hashing the password
        const hashedPassword= await bcrypt.hash(password,10);
        await this.UserModel.create({
            name,
            email,
            password:hashedPassword
        })



    }

    async login(loginData:LoginDto){
const {email,password}=loginData;

  const user= await this.UserModel.findOne({email});
  //if email is not found in db
        if(!user){
            throw new UnauthorizedException("Email not Found");
        }
// if the password is wrong 
        const passwordMatch=await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            throw new UnauthorizedException("Invalid Password");

         }
         //jwt token
         Logger.log("id of user is "+user._id);
        return this.generateUserToken(user._id);      

        }

            async generateUserToken(userId) {
                const accessToken=this.jwtservice.sign({userId},{expiresIn:'1d'})
                return {accessToken,};

}

async changePassword(oldPassword:string,newdPassword:string,userId){
    const user= await this.UserModel.findById(userId);
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

async forgetPassword(email:string){
const user=await this.UserModel.findOne({email});
if(!user){
    throw new NotFoundException("Please verify Your email");
}
const expiryDate=new Date();
expiryDate.setHours(expiryDate.getHours()+1);
const resetToken=nanoid();
await this.resetTokenModel.create({
    token:resetToken,
    userId:user._id,
    expiryDate
});
this.mailService.sendPasswordResetEmail(email,resetToken);

}
}