import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as  bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private UserModel:Model<User>){}
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
         return {message:"succusfully loged In"}
      

        }
}
