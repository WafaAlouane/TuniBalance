import { Injectable, ExecutionContext, CanActivate, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtservice :JwtService){}
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
    request.userId=payload.userId;
   } catch (e) {
    Logger.error(e.message);
    throw new UnauthorizedException("Expired  token");
   }
    return true;
    }
    private extractTokenFromHeader(request: Request):string | undefined{
        // return request.headers.authorisation?.split(' ')[1];
        return (request.headers.authorization as string)?.split(' ')[1];

    }
}