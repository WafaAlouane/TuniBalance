import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../user/user.service';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
      ignoreExpiration: false,
    });
  }

  async validate(payload: { userId: string }): Promise<UserDocument> {
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    return user;
  }
}