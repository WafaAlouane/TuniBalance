import { Injectable, ExecutionContext, CanActivate, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtservice :JwtService ){}
        // ,@InjectModel(User.name) private usrModel:Model<User>){}
  canActivate(
    context: ExecutionContext,
): boolean | Promise<boolean> | Observable<boolean>{
 
 const request=context.switchToHttp().getRequest();

    const token=this.extractTokenFromHeader(request);
    Logger.log("token :"+token);
   if(!token){
    throw new UnauthorizedException("invalid token");
   }
  
   try {
    const payload=this.jwtservice.verify(token)
    Logger.log("Payload user id  "+payload.userId);
    request.userId=payload.userId;
    


   } catch (e) {
    Logger.error(e.message);
    throw new UnauthorizedException("Expired  token");
   }

  // Validate if user is trying to access their own data




    return true;
    }
    private extractTokenFromHeader(request: Request):string | undefined{
        // return request.headers.authorisation?.split(' ')[1];
        return (request.headers.authorization as string)?.split(' ')[1];

    }
}